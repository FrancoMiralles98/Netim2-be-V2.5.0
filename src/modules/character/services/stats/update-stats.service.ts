import { Injectable } from '@nestjs/common';
import {
  AppliedBuffos,
  Atributos,
  AttributesRefKeys,
  CharacterRace,
  CharacterSpeciality,
  EquipType,
  Stats,
} from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { CharacterLevelScalingService } from './calculator/character-level-scaling.service';
import { CharacterAttributesService } from './calculator/character-attributes.service';
import { EquipStatsCalculatorService } from './calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from './calculator/buff-stats-calculator.service';
import { applyBonusModifiers } from './calculator/bonus-modifiers-calculator';

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
   * attributes es la fuente base persistida, sin bonus ya calculados de equipo/buffos.
   * Devuelve stats y attributes calculados en copias; lvPoints se conserva intacto.
   * Para recalcular se debe seguir usando la fuente base, no attributes del resultado.
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

    // 2. Aporte de nivel limitado por raza/especialidad; bonus de la fuente base conservados.
    const sourceAttributes =
      this.attributeCalculator.limitAttributeLevelContributions(
        attributes,
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
      flatStats.stats,
      flatStats.atributos,
      bonuses,
      'porcentage',
      'stats',
    );
    const result = this.limitCalculator.applyBonusLimitsToStats(
      percentageStats.stats,
      bonuses,
      derivedStats,
    );
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
    // Conserva como máximo un decimal, sin redondear y solo al terminar el cálculo.
    this.truncateStatValues(result);

    return { stats: result, attributes: updatedAttributes };
  }

  private assertFiniteNumbers(value: unknown): void {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error('El cálculo de stats requiere valores numéricos finitos');
    }
    if (value && typeof value === 'object') {
      for (const entry of Object.values(value)) this.assertFiniteNumbers(entry);
    }
  }

  private truncateStatValues(value: object): void {
    const values = value as Record<string, unknown>;
    for (const [key, entry] of Object.entries(values)) {
      if (typeof entry === 'number') {
        const truncated = Number.isInteger(entry) ? entry : Math.trunc(entry * 10) / 10;
        values[key] = truncated === 0 ? 0 : truncated;
      } else if (entry && typeof entry === 'object') {
        this.truncateStatValues(entry);
      }
    }
  }
}
