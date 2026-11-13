import type { BonusDefensaRefKeys } from 'netim2-shared';
import { BASE_FIGHT_CONFIG } from '../../character/const/characterProps/base-fight-config.const';
import { MOB_COMBAT_CURVE } from '../config/mob-combat-curve.config';
import { MOB_COMBAT_PERFIL } from '../config/mob-combat-perfil.config';
import { MOB_RACE_MODIFIERS } from '../config/mob-race-modifiers.config';
import { MOB_TARGET_MODIFIERS } from '../config/mob-target-modifiers.config';
import { MOB_DEFENSE_PROGRESSION } from '../const/mob-defense-progression.const';
import { MOB_BASE_STATS } from '../const/mobProps/mob-base-stats.const';
import type { MobCombatCurvePoint, MobCombatModifier, MobStatsOverrides } from '../types/mobProps/mob-combat-config.type';
import type { MobCoreData } from '../types/mobProps/mob-core-data.type';
import type { MobStats } from '../types/mobProps/mob-stats.type';
import type { MobType } from '../types/mobProps/mob.type';

type MobCombatInput = Pick<MobCoreData, 'lv' | 'combatProfile' | 'target_type' | 'raza' | 'stats'>;

/** Genera mobs listos para persistir y usar en combate a partir del catálogo. */
export class MobFactory {
    /** Genera un mob con estadísticas y configuración de combate completas. */
    create(data: MobCoreData): MobType {
        const { combatProfile, stats, fightConfig, ...mob } = data;
        return {
            ...mob,
            fightConfig: structuredClone(fightConfig ?? BASE_FIGHT_CONFIG),
            stats: this.calculateCombatStats({ ...mob, combatProfile, stats }),
        };
    }

    /** Genera cada mob con sus propias estadísticas. */
    createMany(data: MobCoreData[]): MobType[] {
        return data.map(mob => this.create(mob));
    }

    /** Combina la curva, la progresión defensiva, el perfil, el tipo y la raza antes de aplicar ajustes individuales. */
    calculateCombatStats({ lv, combatProfile = 'standard', target_type, raza, stats: overrides }: MobCombatInput): MobStats {
        if (!Number.isSafeInteger(lv) || lv < 1) throw new RangeError('El nivel del mob debe ser un entero positivo');
        const curve = this.getCurveStats(lv);
        const stats = structuredClone(MOB_BASE_STATS);
        Object.assign(stats.general, {
            hp: { max: curve.hp, actual: curve.hp },
            mana: { max: curve.mana, actual: curve.mana },
            ad: curve.ad, ap: curve.ap, def: curve.def,
        });
        for (const key of Object.keys(MOB_DEFENSE_PROGRESSION) as BonusDefensaRefKeys[]) {
            const thresholds = MOB_DEFENSE_PROGRESSION[key] ?? {};
            const reached = Object.keys(thresholds).map(Number).filter(level => level <= lv);
            stats.bonus.defensa[key] += thresholds[Math.max(...reached)] ?? 0;
        }
        const modifiers = [MOB_COMBAT_PERFIL[combatProfile], MOB_TARGET_MODIFIERS[target_type], MOB_RACE_MODIFIERS[raza]];
        let extraDefense = 0;
        for (const modifier of modifiers) {
            if (!modifier) continue;
            this.applyModifier(stats, modifier);
            extraDefense += modifier.extraDefense ?? 0;
        }
        for (const modifier of modifiers) {
            if (modifier?.generalBonuses) this.applyGeneralBonuses(stats.general, modifier.generalBonuses);
        }
        const { general } = stats;
        general.def = Math.round(general.def + extraDefense);
        for (const key of ['ad', 'ap'] as const) {
            general[key] = { min: Math.round(general[key].min), max: Math.round(general[key].max) };
        }
        for (const key of ['hp', 'mana'] as const) {
            const max = Math.round(general[key].max);
            general[key] = { max, actual: max };
        }
        return this.applyOverrides(stats, overrides);
    }

    /** Interpola los valores entre dos niveles y usa el último punto al superar la curva. */
    private getCurveStats(level: number): MobCombatCurvePoint {
        const upper = MOB_COMBAT_CURVE.findIndex(point => level <= point.level);
        const last = MOB_COMBAT_CURVE[MOB_COMBAT_CURVE.length - 1];
        if (upper <= 0) return structuredClone(upper === 0 ? MOB_COMBAT_CURVE[0] : last);
        const start = MOB_COMBAT_CURVE[upper - 1];
        const end = MOB_COMBAT_CURVE[upper];
        const ratio = (level - start.level) / (end.level - start.level);
        const interpolate = (from: number, to: number) => from + (to - from) * ratio;
        return {
            level,
            hp: interpolate(start.hp, end.hp),
            mana: interpolate(start.mana, end.mana),
            def: interpolate(start.def, end.def),
            ad: { min: interpolate(start.ad.min, end.ad.min), max: interpolate(start.ad.max, end.ad.max) },
            ap: { min: interpolate(start.ap.min, end.ap.min), max: interpolate(start.ap.max, end.ap.max) },
        };
    }

    /** Aplica multiplicadores y suma bonus de daño y defensa. */
    private applyModifier(stats: MobStats, { multipliers, damageBonuses, defenseBonuses }: MobCombatModifier): void {
        const { general, bonus } = stats;
        general.def *= multipliers?.def ?? 1;
        for (const key of ['hp', 'mana'] as const) general[key].max *= multipliers?.[key] ?? 1;
        for (const key of ['ad', 'ap'] as const) {
            const multiplier = multipliers?.[key] ?? 1;
            general[key].min *= multiplier;
            general[key].max *= multiplier;
        }
        for (const key of Object.keys(damageBonuses ?? {}) as (keyof MobStats['bonus']['daño'])[]) {
            bonus.daño[key] += damageBonuses?.[key] ?? 0;
        }
        for (const key of Object.keys(defenseBonuses ?? {}) as BonusDefensaRefKeys[]) {
            bonus.defensa[key] += defenseBonuses?.[key] ?? 0;
        }
    }

    /** Suma los bonus planos a stats, rangos y máximos de recursos. */
    private applyGeneralBonuses(general: MobStats['general'], bonuses: NonNullable<MobCombatModifier['generalBonuses']>): void {
        for (const key of Object.keys(bonuses) as (keyof MobStats['general'])[]) {
            const value = bonuses[key] ?? 0;
            switch (key) {
                case 'hp':
                case 'mana':
                    general[key].max += value;
                    break;
                case 'ad':
                case 'ap':
                    general[key].min += value;
                    general[key].max += value;
                    break;
                default:
                    general[key] += value;
            }
        }
    }

    /** Aplica los valores individuales y conserva ambos extremos de cada rango o recurso. */
    private applyOverrides(stats: MobStats, overrides?: MobStatsOverrides): MobStats {
        if (!overrides) return stats;
        const { general = {}, bonus = {} } = overrides;
        const updated = { ...stats.general, ...general,
            ad: { ...stats.general.ad, ...general.ad },
            ap: { ...stats.general.ap, ...general.ap },
            hp: { ...stats.general.hp, ...general.hp },
            mana: { ...stats.general.mana, ...general.mana },
        };
        for (const key of ['hp', 'mana'] as const) {
            const actual = general[key]?.actual ?? updated[key].max;
            updated[key].actual = Math.min(actual, updated[key].max);
        }
        return { general: updated, bonus: {
            daño: { ...stats.bonus.daño, ...bonus.daño },
            defensa: { ...stats.bonus.defensa, ...bonus.defensa },
            cc: { ...stats.bonus.cc, ...bonus.cc },
            miscs: { ...stats.bonus.miscs, ...bonus.miscs },
        } };
    }
}
