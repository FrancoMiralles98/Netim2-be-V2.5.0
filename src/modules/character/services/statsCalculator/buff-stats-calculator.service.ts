import { Injectable } from '@nestjs/common';
import { AppliedBuffos, Atributos, BonusInItem, RoutStatKey, Stats, ValueBonusType } from 'netim2-shared';

export interface BuffStatsResult {
    stats: Stats;
    atributos: Atributos;
}

type BonusRange = { min: number; max: number };

@Injectable()
export class BuffStatsCalculatorService {
    /** Suma los bonus planos de los buffos aplicados sin modificar los objetos recibidos. */
    applyBuffFlatBonuses(stats: Stats, atributos: Atributos, buffos: AppliedBuffos[]): BuffStatsResult {
        return this.applyBuffBonuses(stats, atributos, buffos, 'flat');
    }

    /**
     * Acumula los porcentajes de todos los buffos aplicados por destino y aplica una sola operación por stat.
     * Se puede invocar con el resultado de applyBuffFlatBonuses.
     * En atributos solo modifica bonusPoints, conservando lvPoints.
     */
    applyBuffPercentageBonuses(stats: Stats, atributos: Atributos, buffos: AppliedBuffos[]): BuffStatsResult {
        return this.applyBuffBonuses(stats, atributos, buffos, 'porcentage');
    }

    private applyBuffBonuses(
        stats: Stats,
        atributos: Atributos,
        buffos: AppliedBuffos[],
        operation: ValueBonusType,
    ): BuffStatsResult {
        const result = { stats: structuredClone(stats), atributos: structuredClone(atributos) };
        const statTotals = new Map<RoutStatKey, BonusRange>();
        const attributeTotals = new Map<keyof Atributos, number>();

        for (const buff of buffos) {
            for (const bonus of this.getBuffBonuses(buff)) {
                const effect = bonus.effects;
                // Caps y efectos condicionales pertenecen a sus respectivos sistemas.
                if (effect.operation !== operation ||
                    (effect.type !== 'stat_modifiers' && effect.type !== 'attribute_modifier')) {
                    continue;
                }

                if (effect.type === 'attribute_modifier') {
                    if (typeof bonus.bonusValue !== 'number') {
                        throw new Error('Un bonus de atributo debe tener un valor numérico');
                    }
                    const attribute = effect.target.split('.')[1] as keyof Atributos;
                    attributeTotals.set(attribute,
                        (attributeTotals.get(attribute) ?? 0) + bonus.bonusValue);
                    continue;
                }

                // Un valor numérico aporta lo mismo a ambos extremos de AD/AP.
                const range = typeof bonus.bonusValue === 'number'
                    ? { min: bonus.bonusValue, max: bonus.bonusValue }
                    : bonus.bonusValue;
                for (const target of new Set(effect.target)) {
                    const total = statTotals.get(target) ?? { min: 0, max: 0 };
                    statTotals.set(target, {
                        min: total.min + range.min,
                        max: total.max + range.max,
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

    private getBuffBonuses(buff: AppliedBuffos): BonusInItem[] {
        return [
            ...(buff.implicitBonus ?? []),
            ...(buff.corruptBonus ?? []),
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
