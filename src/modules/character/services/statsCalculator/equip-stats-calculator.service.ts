import { Injectable } from '@nestjs/common';
import { Atributos, BonusInItem, EquipType, RoutStatKey, Stats, ValueBonusType } from 'netim2-shared';

export interface EquipmentStatsResult {
    stats: Stats;
    atributos: Atributos;
}

type BonusRange = { min: number; max: number };

@Injectable()
export class EquipStatsCalculatorService {
    /** Suma los bonus planos del equipo y sus piedras sin modificar los objetos recibidos. */
    applyEquipmentFlatBonuses(stats: Stats, atributos: Atributos, equip: EquipType[]): EquipmentStatsResult {
        return this.applyEquipmentBonuses(stats, atributos, equip, 'flat');
    }

    /**
     * Acumula los porcentajes del equipo y sus piedras por destino y aplica una sola operación por stat.
     * Se puede invocar con el resultado de applyEquipmentFlatBonuses.
     * En atributos solo modifica bonusPoints, conservando lvPoints.
     */
    applyEquipmentPercentageBonuses(stats: Stats, atributos: Atributos, equip: EquipType[]): EquipmentStatsResult {
        return this.applyEquipmentBonuses(stats, atributos, equip, 'porcentage');
    }

    private applyEquipmentBonuses(
        stats: Stats,
        atributos: Atributos,
        equip: EquipType[],
        operation: ValueBonusType,
    ): EquipmentStatsResult {
        const result = { stats: structuredClone(stats), atributos: structuredClone(atributos) };
        const statTotals = new Map<RoutStatKey, BonusRange>();
        const attributeTotals = new Map<keyof Atributos, number>();
        const corruptItems = equip.filter(item => item.corrupt === true).length;

        for (const item of equip) {
            for (const bonus of this.getEquipmentBonuses(item)) {
                const effect = bonus.effects;
                // Caps y efectos condicionales pertenecen a sus respectivos sistemas.
                if (effect.operation !== operation ||
                    (effect.type !== 'stat_modifiers' && effect.type !== 'attribute_modifier')) {
                    continue;
                }
                const multiplier = bonus.category.type === 'corrupt' &&
                    bonus.category.sub_type === 'corrupt_item_acc' ? corruptItems : 1;

                if (effect.type === 'attribute_modifier') {
                    if (typeof bonus.bonusValue !== 'number') {
                        throw new Error('Un bonus de atributo debe tener un valor numérico');
                    }
                    const attribute = effect.target.split('.')[1] as keyof Atributos;
                    attributeTotals.set(attribute,
                        (attributeTotals.get(attribute) ?? 0) + bonus.bonusValue * multiplier);
                    continue;
                }

                // Un valor numérico aporta lo mismo a ambos extremos de AD/AP.
                const range = typeof bonus.bonusValue === 'number'
                    ? { min: bonus.bonusValue, max: bonus.bonusValue }
                    : bonus.bonusValue;
                for (const target of new Set(effect.target)) {
                    const total = statTotals.get(target) ?? { min: 0, max: 0 };
                    statTotals.set(target, {
                        min: total.min + range.min * multiplier,
                        max: total.max + range.max * multiplier,
                    });
                }
            }
        }

        for (const [target, total] of statTotals) {
            this.applyStatTotal(result.stats, target, total, operation);
        }
        for (const [attribute, total] of attributeTotals) {
            result.atributos[attribute].bonusPoints = this.applyValue(
                result.atributos[attribute].bonusPoints, total, operation);
        }
        return result;
    }

    private getEquipmentBonuses(item: EquipType): BonusInItem[] {
        return [
            ...(item.implicitBonus ?? []),
            ...(item.randomImplicitBonus ?? []),
            ...(item.explicitBonus ?? []),
            ...(item.bonus6_7 ?? []),
            ...(item.corruptExplicitBonus ?? []),
            ...(item.corruptImplicitBonus ?? []),
            ...(item.piedras ?? []).flatMap(piedra => [
                ...(piedra.implicitBonus ?? []),
                ...(piedra.corruptExplicitBonus ?? []),
            ]),
        ];
    }

    private applyStatTotal(stats: Stats, target: RoutStatKey, total: BonusRange, operation: ValueBonusType): void {
        if (target === 'general.ad' || target === 'general.ap') {
            const range = target === 'general.ad' ? stats.general.ad : stats.general.ap;
            range.min = this.applyValue(range.min, total.min, operation);
            range.max = this.applyValue(range.max, total.max, operation);
            return;
        }

        if (total.min !== total.max) {
            throw new Error(`El bonus con rango solo puede aplicarse a AD/AP: ${target}`);
        }
        if (target === 'general.hp' || target === 'general.mana') {
            const resource = target === 'general.hp' ? stats.general.hp : stats.general.mana;
            resource.max = this.applyValue(resource.max, total.min, operation);
            return;
        }

        const parts = target.split('.');
        const group = parts[0] === 'general'
            ? stats.general
            : stats.bonus[parts[1] as keyof Stats['bonus']];
        const values = group as unknown as Record<string, number>;
        const key = parts[parts.length - 1];
        if (typeof values?.[key] !== 'number') {
            throw new Error(`No existe una estadística numérica para el destino ${target}`);
        }
        values[key] = this.applyValue(values[key], total.min, operation);
    }

    private applyValue(base: number, total: number, operation: ValueBonusType): number {
        return operation === 'flat' ? base + total : base * (1 + total / 100);
    }
}
