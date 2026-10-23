import { Injectable } from '@nestjs/common';
import {
  Atributos,
  AttributesRefKeys,
  BonusInItem,
  BonusRefKeys,
  CharacterRace,
  CharacterSpeciality,
  EquipType,
  Stats,
} from 'netim2-shared';
import { ATTRIBUTE_EFFECTS_CONFIG } from '../../../../gameData/const/attributes-config';
import { ATTRIBUTE_RACE_CAPS } from '../../../const/statsProgress/attribute-race-caps.const';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../../../const/statsProgress/attribute-speciality-caps.const';
import { ATTRIBUTE_BASE_BY_RACE } from '../../../const/statsProgress/attribute-base-by-race.const';
import { GENERAL_ATTRIBUTE_CAP } from '../../../const/statsProgress/general-attribute-cap.const';
import { collectEquipmentBonuses } from './equipment-bonuses';
import { applyBonusValue } from '../../../../shared/utils/bonus-value-modifier';

export interface AttributeStatsResult {
  stats: Stats;
  atributos: Atributos;
}

@Injectable()
export class CharacterAttributesService {
  /** Asigna los puntos iniciales de la raza a lvPoints y conserva bonusPoints. */
  applyBaseAttributes(atributos: Atributos, race: CharacterRace): Atributos {
    const base = ATTRIBUTE_BASE_BY_RACE[race];
    const result = structuredClone(atributos);
    for (const attribute of Object.keys(base) as AttributesRefKeys[]) {
      result[attribute].lvPoints = base[attribute];
    }
    return result;
  }

  /** Aplica beneficios con puntos efectivos limitados, conservando los atributos. */
  applyAttributeBenefits(
    stats: Stats,
    atributos: Atributos,
    equip: EquipType[],
    race: CharacterRace,
    speciality?: CharacterSpeciality,
    additionalBonuses: BonusInItem[] = [],
  ): AttributeStatsResult {
    const effectivePoints = this.capAttributes(
      atributos,
      equip,
      race,
      speciality,
      additionalBonuses,
    );
    return {
      stats: this.applyEffectiveAttributeBenefits(stats, effectivePoints),
      atributos: structuredClone(atributos),
    };
  }

  /** Solo deriva stats: recibe puntos efectivos ya limitados y no consulta fuentes ni caps. */
  applyEffectiveAttributeBenefits(
    stats: Stats,
    effectivePoints: Record<AttributesRefKeys, number>,
  ): Stats {
    const result = structuredClone(stats);
    const totals = new Map<BonusRefKeys, number>();
    for (const attribute of Object.keys(
      effectivePoints,
    ) as AttributesRefKeys[]) {
      if (!Number.isFinite(effectivePoints[attribute])) {
        throw new Error('Los atributos efectivos deben ser finitos');
      }
      for (const [ref, perPoint] of Object.entries(
        ATTRIBUTE_EFFECTS_CONFIG[attribute],
      ) as [BonusRefKeys, number][]) {
        totals.set(
          ref,
          (totals.get(ref) ?? 0) + effectivePoints[attribute] * perPoint,
        );
      }
    }
    for (const [ref, value] of totals)
      this.applyStatBenefit(result, ref, value);
    return result;
  }

  /** Limita solo el aporte de nivel sobre una copia; nunca modifica los puntos persistidos. */
  limitAttributeLevelContributions(
    atributos: Atributos,
    race: CharacterRace,
    speciality?: CharacterSpeciality,
  ): Atributos {
    const caps = speciality
      ? ATTRIBUTE_SPECIALITY_CAPS[speciality]
      : ATTRIBUTE_RACE_CAPS[race];
    if (!caps)
      throw new Error(
        'No existe configuración de caps para la raza o especialidad',
      );
    const result = structuredClone(atributos);
    for (const attribute of Object.keys(result) as AttributesRefKeys[]) {
      result[attribute].lvPoints = Math.min(
        result[attribute].lvPoints,
        caps[attribute],
      );
    }
    return result;
  }

  /** API de conveniencia para atributos sin el aporte de nivel previamente limitado. */
  capAttributes(
    atributos: Atributos,
    equip: EquipType[],
    race: CharacterRace,
    speciality?: CharacterSpeciality,
    additionalBonuses: BonusInItem[] = [],
  ): Record<AttributesRefKeys, number> {
    return this.capEffectiveAttributes(
      this.limitAttributeLevelContributions(atributos, race, speciality),
      [...collectEquipmentBonuses(equip), ...additionalBonuses],
    );
  }

  /** Cap general aplicado una vez al total efectivo. Los bonus ya tienen su corrupción resuelta. */
  capEffectiveAttributes(
    atributos: Atributos,
    bonuses: BonusInItem[],
  ): Record<AttributesRefKeys, number> {
    const caps = this.getGeneralAttributeCaps(bonuses);
    const effectivePoints = { ...caps };
    for (const attribute of Object.keys(
      effectivePoints,
    ) as AttributesRefKeys[]) {
      effectivePoints[attribute] = Math.min(
        caps[attribute],
        atributos[attribute].lvPoints + atributos[attribute].bonusPoints,
      );
    }
    return effectivePoints;
  }

  private getGeneralAttributeCaps(
    bonuses: BonusInItem[],
  ): Record<AttributesRefKeys, number> {
    const flat = new Map<AttributesRefKeys, number>();
    const percentage = new Map<AttributesRefKeys, number>();
    for (const bonus of bonuses) {
      const effect = bonus.effects;
      if (effect.type !== 'attribute_cap_modifier') continue;
      if (
        typeof bonus.bonusValue !== 'number' ||
        !Number.isFinite(bonus.bonusValue)
      ) {
        throw new Error(
          'Un modificador de cap de atributo debe tener un valor numérico finito',
        );
      }
      const totals = effect.operation === 'flat' ? flat : percentage;
      totals.set(
        effect.target,
        (totals.get(effect.target) ?? 0) + bonus.bonusValue,
      );
    }
    const result: Record<AttributesRefKeys, number> = {
      STR: GENERAL_ATTRIBUTE_CAP,
      INT: GENERAL_ATTRIBUTE_CAP,
      DEX: GENERAL_ATTRIBUTE_CAP,
      VIT: GENERAL_ATTRIBUTE_CAP,
    };
    for (const attribute of Object.keys(result) as AttributesRefKeys[]) {
      const subtotal = applyBonusValue(
        GENERAL_ATTRIBUTE_CAP,
        flat.get(attribute) ?? 0,
        'flat',
      );
      result[attribute] = Math.max(
        0,
        applyBonusValue(subtotal, percentage.get(attribute) ?? 0, 'porcentage'),
      );
    }
    return result;
  }

  private applyStatBenefit(
    stats: Stats,
    ref: BonusRefKeys,
    value: number,
  ): void {
    if (ref === 'hp') {
      stats.general.hp.max = applyBonusValue(
        stats.general.hp.max,
        value,
        'porcentage',
      );
      return;
    }
    if (ref === 'ad' || ref === 'ap') {
      stats.general[ref].min = applyBonusValue(
        stats.general[ref].min,
        value,
        'flat',
      );
      stats.general[ref].max = applyBonusValue(
        stats.general[ref].max,
        value,
        'flat',
      );
      return;
    }
    if (ref === 'mana') {
      stats.general.mana.max = applyBonusValue(
        stats.general.mana.max,
        value,
        'flat',
      );
      return;
    }
    const general = stats.general as unknown as Record<string, number>;
    if (typeof general[ref] === 'number') {
      general[ref] = applyBonusValue(general[ref], value, 'flat');
      return;
    }
    for (const group of Object.values(stats.bonus)) {
      const values = group as Record<string, number>;
      if (typeof values[ref] === 'number') {
        values[ref] = applyBonusValue(values[ref], value, 'flat');
        return;
      }
    }
    throw new Error(
      `No existe una estadística para el efecto de atributo ${ref}`,
    );
  }
}
