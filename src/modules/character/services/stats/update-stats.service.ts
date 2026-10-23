import { Injectable } from '@nestjs/common';
import {
  AppliedBuffos,
  Atributos,
  AttributesRefKeys,
  CharacterRace,
  CharacterSpeciality,
  EquipType,
  BonusRefKeys,
  ReinosNames,
  Stats,
} from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { CharacterLevelScalingService } from './calculator/character-level-scaling.service';
import { CharacterAttributesService } from './calculator/character-attributes.service';
import { EquipStatsCalculatorService } from './calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from './calculator/buff-stats-calculator.service';
import { applyBonusModifiers } from './calculator/bonus-modifiers-calculator';
import { ReinosBuff } from '../../../gameData/reinos/reinos-buff.config';
import { DODGE_CHANCE_PER_MOVEMENT_SPEED, SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED } from '../../../gameData/const/bonus.const';

export interface UpdatedStatsResult {
  stats: Stats;
  attributes: Atributos;
}

@Injectable()
export class UpdateStatsService {
  constructor(
    private readonly levelCalculator: CharacterLevelScalingService,
    private readonly attributeCalculator: CharacterAttributesService,
    private readonly equipmentCalculator: EquipStatsCalculatorService,
    private readonly buffCalculator: BuffStatsCalculatorService,
    private readonly limitCalculator: LimitBonusService,
  ) {}

  /**
   * Reconstruye stats desde las constantes; del snapshot recibido solo usa HP/mana actuales.
   * Usa lvPoints como fuente base; reconstruye bonusPoints desde equipo y buffos.
   * Devuelve stats y attributes calculados en copias; lvPoints se conserva intacto.
   * Permite recalcular usando attributes del resultado sin acumular bonus previos.
   * level procede de CharacterModel.lv; no se puede deducir de Stats.
   */
  updateStats(
    stats: Stats,
    race: CharacterRace,
    equipment: EquipType[],
    attributes: Atributos,
    buffs: AppliedBuffos[],
    level: number,
    speciality?: CharacterSpeciality,
    kingdom?: ReinosNames,
  ): UpdatedStatsResult {
    this.assertFiniteNumbers(attributes);
    this.assertFiniteNumbers(equipment);
    this.assertFiniteNumbers(buffs);
    this.assertFiniteNumbers(stats.general.hp.actual);
    this.assertFiniteNumbers(stats.general.mana.actual);

    // 1. Reconstrucción: nunca volver a sumar al snapshot ya calculado.
    const initial = this.levelCalculator.applyLevelScaling(
      GENERAL_CHARACTER_STATS,
      race,
      level,
    );
    const equipmentBonuses = this.equipmentCalculator.getBonuses(equipment);
    const buffBonuses = this.buffCalculator.getBonuses(buffs);
    const bonuses = [...equipmentBonuses, ...buffBonuses];

    // 2. Conserva el aporte de nivel y descarta los bonus del cálculo anterior.
    const baseAttributes = structuredClone(attributes);
    for (const attribute of Object.keys(baseAttributes) as AttributesRefKeys[]) {
      baseAttributes[attribute].bonusPoints = 0;
    }
    const sourceAttributes =
      this.attributeCalculator.limitAttributeLevelContributions(
        baseAttributes,
        race,
        speciality,
      );
    const flatAttributes = applyBonusModifiers(
      initial,
      sourceAttributes,
      bonuses,
      'flat',
      'attributes',
    );
    const effectiveAttributes = applyBonusModifiers(
      initial,
      flatAttributes.atributos,
      bonuses,
      'porcentage',
      'attributes',
      'total',
    );

    // 3. Stats derivadas calculadas con los atributos efectivos y sus caps.
    const effectivePoints = this.attributeCalculator.capEffectiveAttributes(
      effectiveAttributes.atributos,
      bonuses,
    );
    const derivedStats =
      this.attributeCalculator.applyEffectiveAttributeBenefits(
        initial,
        effectivePoints,
      );

    // 4. Primero todos los flats; después un único porcentaje acumulado por destino.
    const flatStats = applyBonusModifiers(
      derivedStats,
      effectiveAttributes.atributos,
      bonuses,
      'flat',
      'stats',
    );
    const percentageStats = applyBonusModifiers(
      this.applyKingdomBonuses(flatStats.stats, kingdom),
      flatStats.atributos,
      bonuses,
      'porcentage',
      'stats',
    );
    const limitedStats = this.limitCalculator.applyBonusLimitsToStats(
      percentageStats.stats,
      bonuses,
      derivedStats,
    );

    // VM efectiva después de límites; la esquiva se suma a la aportada por equipo/buffos.
    const movementSpeed = Math.max(0, limitedStats.general.vm);
    limitedStats.bonus.defensa.esquivar_ataques += movementSpeed * DODGE_CHANCE_PER_MOVEMENT_SPEED;
    limitedStats.bonus.defensa.esquivar_hechizos += movementSpeed * SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED;
    const result = this.limitCalculator.applyBonusLimitsToStats(limitedStats, bonuses, derivedStats);
    this.assertFiniteNumbers(result);

    // 5. Normalización; incrementar máximos no cura ni regenera recursos actuales.
    for (const range of [result.general.ad, result.general.ap]) {
      const endpoints = [range.min, range.max];
      range.min = Math.min(...endpoints);
      range.max = Math.max(...endpoints);
    }
    for (const resource of ['hp', 'mana'] as const) {
      result.general[resource].max = Math.max(0, result.general[resource].max);
      result.general[resource].actual = Math.max(
        0,
        Math.min(stats.general[resource].actual, result.general[resource].max),
      );
    }
    this.assertFiniteNumbers(result);
    const updatedAttributes = structuredClone(attributes);
    for (const attribute of Object.keys(
      updatedAttributes,
    ) as AttributesRefKeys[]) {
      updatedAttributes[attribute].bonusPoints =
        effectiveAttributes.atributos[attribute].bonusPoints;
    }
    this.assertFiniteNumbers(updatedAttributes);
    // Normaliza únicamente al terminar: recursos, daño, defensa y regeneración enteros.
    for (const key of ['hp', 'mana', 'ad', 'ap'] as const) {
      this.truncateStatValues(result.general[key], 0);
    }
    for (const key of ['def', 'regen_hp', 'regen_mana'] as const) {
      const truncated = Math.trunc(result.general[key]);
      result.general[key] = truncated === 0 ? 0 : truncated;
    }
    // El resto conserva como máximo un decimal, sin redondear.
    this.truncateStatValues(result);

    return { stats: result, attributes: updatedAttributes };
  }

  private applyKingdomBonuses(stats: Stats, kingdom?: ReinosNames): Stats {
    if (!kingdom) return stats;
    const config = ReinosBuff[kingdom];
    if (!config) throw new Error('No existe configuración de bonus para el reino');
    this.assertFiniteNumbers(config);
    for (const [ref, value] of Object.entries(config) as [BonusRefKeys, number][]) {
      const group = Object.values(stats.bonus).find(values => ref in values) as Partial<Record<BonusRefKeys, number>> | undefined;
      if (!group) throw new Error(`No se encuentra la stat del bonus de reino: ${ref}`);
      group[ref] = (group[ref] ?? 0) + value;
    }
    return stats;
  }

  private assertFiniteNumbers(value: unknown): void {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error('El cálculo de stats requiere valores numéricos finitos');
    }
    if (value && typeof value === 'object') {
      for (const entry of Object.values(value)) this.assertFiniteNumbers(entry);
    }
  }

  private truncateStatValues(value: object, decimals: 0 | 1 = 1): void {
    const factor = 10 ** decimals;
    const values = value as Record<string, unknown>;
    for (const [key, entry] of Object.entries(values)) {
      if (typeof entry === 'number') {
        const truncated = Number.isInteger(entry) ? entry : Math.trunc(entry * factor) / factor;
        values[key] = truncated === 0 ? 0 : truncated;
      } else if (entry && typeof entry === 'object') {
        this.truncateStatValues(entry, decimals);
      }
    }
  }
}
