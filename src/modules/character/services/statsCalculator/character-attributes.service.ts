import { Injectable } from '@nestjs/common';
import {
    ATTRIBUTE_EFFECTS_CONFIG, Atributos, AttributesRefKeys, BonusInItem,
    BonusRefKeys, CharacterRace, CharacterSpeciality, EquipType, Stats,
} from 'netim2-shared';
import { ATTRIBUTE_RACE_CAPS } from '../../const/statsProgress/attribute-race-caps.const';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../../const/statsProgress/attribute-speciality-caps.const';
import { ATTRIBUTE_BASE_BY_RACE } from '../../const/statsProgress/attribute-base-by-race.const';

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
    ): AttributeStatsResult {
        const effectivePoints = this.capAttributes(atributos, equip, race, speciality);
        const result = structuredClone(stats);
        const totals = new Map<BonusRefKeys, number>();

        for (const attribute of Object.keys(effectivePoints) as AttributesRefKeys[]) {
            const points = effectivePoints[attribute];
            const effects = ATTRIBUTE_EFFECTS_CONFIG[attribute];
            for (const [ref, perPoint] of Object.entries(effects) as [BonusRefKeys, number][]) {
                totals.set(ref, (totals.get(ref) ?? 0) + points * perPoint);
            }
        }
        for (const [ref, value] of totals) {
            this.applyStatBenefit(result, ref, value);
        }
        return { stats: result, atributos: structuredClone(atributos) };
    }

    /**
     * Devuelve los puntos efectivos: min(lvPoints + bonusPoints, cap).
     * Conserva intactos lvPoints y bonusPoints, aunque superen el límite.
     * Los modificadores planos se suman y luego se aplica el porcentaje acumulado.
     */
    capAttributes(
        atributos: Atributos,
        equip: EquipType[],
        race: CharacterRace,
        speciality?: CharacterSpeciality,
    ): Record<AttributesRefKeys, number> {
        const caps = this.getAttributeCaps(equip, race, speciality);
        const effectivePoints = { ...caps };
        for (const attribute of Object.keys(effectivePoints) as AttributesRefKeys[]) {
            effectivePoints[attribute] = Math.min(caps[attribute],
                atributos[attribute].lvPoints + atributos[attribute].bonusPoints);
        }
        return effectivePoints;
    }

    private getAttributeCaps(
        equip: EquipType[],
        race: CharacterRace,
        speciality?: CharacterSpeciality,
    ): Record<AttributesRefKeys, number> {
        const caps = speciality ? ATTRIBUTE_SPECIALITY_CAPS[speciality] : ATTRIBUTE_RACE_CAPS[race];
        if (!caps) {
            throw new Error('No existe configuración de caps para la raza o especialidad');
        }
        const flat = new Map<AttributesRefKeys, number>();
        const percentage = new Map<AttributesRefKeys, number>();
        const corruptItems = equip.filter(item => item.corrupt === true).length;

        for (const item of equip) {
            for (const bonus of this.getCapBonuses(item)) {
                const effect = bonus.effects;
                if (effect.type !== 'attribute_cap_modifier') {
                    continue;
                }
                if (typeof bonus.bonusValue !== 'number') {
                    throw new Error('Un modificador de cap de atributo debe tener un valor numérico');
                }
                const multiplier = bonus.category.type === 'corrupt' &&
                    bonus.category.sub_type === 'corrupt_item_acc' ? corruptItems : 1;
                const totals = effect.operation === 'flat' ? flat : percentage;
                totals.set(effect.target, (totals.get(effect.target) ?? 0) + bonus.bonusValue * multiplier);
            }
        }

        const result = { ...caps };
        for (const attribute of Object.keys(result) as AttributesRefKeys[]) {
            result[attribute] = Math.max(0,
                (caps[attribute] + (flat.get(attribute) ?? 0)) *
                (1 + (percentage.get(attribute) ?? 0) / 100));
        }
        return result;
    }

    private getCapBonuses(item: EquipType): BonusInItem[] {
        return [
            ...(item.implicitBonus ?? []),
            ...(item.randomImplicitBonus ?? []),
            ...(item.explicitBonus ?? []),
            ...(item.bonus6_7 ?? []),
            ...(item.corruptExplicitBonus ?? []),
            ...(item.corruptImplicitBonus ?? []),
        ];
    }

    private applyStatBenefit(stats: Stats, ref: BonusRefKeys, value: number): void {
        if (ref === 'hp') {
            stats.general.hp.max *= 1 + value / 100;
            return;
        }
        if (ref === 'ad' || ref === 'ap') {
            stats.general[ref].min += value;
            stats.general[ref].max += value;
            return;
        }
        if (ref === 'mana') {
            stats.general.mana.max += value;
            return;
        }
        const general = stats.general as unknown as Record<string, number>;
        if (typeof general[ref] === 'number') {
            general[ref] += value;
            return;
        }
        for (const group of Object.values(stats.bonus)) {
            const values = group as Record<string, number>;
            if (typeof values[ref] === 'number') {
                values[ref] += value;
                return;
            }
        }
        throw new Error(`No existe una estadística para el efecto de atributo ${ref}`);
    }
}
