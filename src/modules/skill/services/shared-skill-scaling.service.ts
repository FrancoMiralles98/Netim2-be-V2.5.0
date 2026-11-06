import { Injectable } from '@nestjs/common';
import type {
    Atributos, BonusRefKeys, DurationConfig, SkillBase, SkillCooldownConfig,
    SkillCooldownScaling, SkillDurationScaling, SkillLeveledMasteryRank,
    SkillManaCost, SkillManaCostScaling, SkillProgressionLimits, SkillProgressionPoint,
    SkillRangeScaling, SkillScalingSource, SkillStatModifierScaling,
    SkillValueProgression, SkillValueScaling, Stats, StatsModifiers,
} from 'netim2-shared';
import { SKILL_PROGRESSION_LIMITS } from '../config/skill-progression-limits.config';
import type { SkillScalingContext } from '../types/skill-scaling-context.type';

const MASTERY_ORDER = { N: 0, M: 1, G: 2, P: 3 } as const;
const LEVELED_RANKS: readonly SkillLeveledMasteryRank[] = ['N', 'M', 'G'];

/** Calcula valores compartidos de skills. */
@Injectable()
export class SharedSkillScalingService {
    /** Usa lv dentro de mastery; P no tiene subnivel. Conserva las referencias de stats y atributos. */
    createContext(skill: Pick<SkillBase, 'lv' | 'mastery'>, stats?: Stats, attributes?: Atributos): SkillScalingContext {
        const progression: SkillProgressionPoint = skill.mastery === 'P'
            ? { rank: 'P' }
            : { rank: skill.mastery, level: skill.lv };
        this.validateProgression(progression, SKILL_PROGRESSION_LIMITS);
        return { progression, stats, attributes };
    }

    /**
     * Calcula (progresión + flats) × (1 + porcentajes acumulados / 100); luego limita y trunca.
     * @throws Si faltan fuentes requeridas o los números, límites o precisión son inválidos.
     */
    calculateValue(scaling: SkillValueScaling, context: SkillScalingContext): number {
        let flat = 0;
        let increased = 0;
        const base = this.calculateProgression(scaling.progression, context);
        for (const contribution of scaling.contributions ?? []) {
            const amount = this.readSource(contribution.source, context)
                * this.finite(contribution.coefficient, 'coefficient');
            switch (contribution.operation) {
                case 'flat': flat += amount; break;
                case 'increased': increased += amount; break;
                default: throw new Error('Operación de contribución de skill no soportada');
            }
        }
        return this.normalize((base + flat) * (1 + increased / 100), scaling);
    }

    /**
     * Resuelve constantes, crecimiento acumulativo o umbrales, sin contribuciones de stats/atributos.
     * N1 = base; M1/G1 suman su primer incremento y conservan rangos anteriores; P agrega perfectBonus.
     */
    calculateProgression(scaling: SkillValueProgression, context: SkillScalingContext): number {
        const limits = context.limits ?? SKILL_PROGRESSION_LIMITS;
        const point = context.progression;
        this.validateProgression(point, limits);
        let value: number;
        switch (scaling.type) {
            case 'constant':
                value = scaling.value;
                break;
            case 'per_level': {
                value = this.finite(scaling.base, 'base');
                for (const rank of LEVELED_RANKS) {
                    const increment = this.finite(scaling.perLevel[rank], `perLevel.${rank}`);
                    if (MASTERY_ORDER[rank] > MASTERY_ORDER[point.rank]) continue;
                    const level = point.rank === rank ? point.level : limits.maxLevelByRank[rank];
                    const steps = rank === 'N' ? level - 1 : level;
                    value += steps * increment;
                }
                if (point.rank === 'P') value += this.finite(scaling.perfectBonus ?? 0, 'perfectBonus');
                break;
            }
            case 'thresholds':
                value = this.finite(scaling.base, 'base');
                for (const threshold of scaling.thresholds) {
                    this.validateProgression(threshold.at, limits);
                    const addition = this.finite(threshold.add, 'threshold.add');
                    if (this.compare(point, threshold.at) >= 0) value += addition;
                }
                break;
            default:
                throw new Error('Tipo de progresión de skill no soportado');
        }
        return this.finite(value, 'progression result');
    }

    /** Comprueba rango y subnivel requeridos. Sin requisito está habilitado; no reinicia la progresión. */
    isUnlocked(unlockAt: SkillProgressionPoint | undefined, context: SkillScalingContext): boolean {
        const limits = context.limits ?? SKILL_PROGRESSION_LIMITS;
        this.validateProgression(context.progression, limits);
        if (!unlockAt) return true;
        this.validateProgression(unlockAt, limits);
        return this.compare(context.progression, unlockAt) >= 0;
    }

    /** Devuelve turnos enteros >= 0 por evento; conserva la diferencia entre omisión y cero explícito. */
    calculateCooldowns(scaling: SkillCooldownScaling, context: SkillScalingContext): SkillCooldownConfig {
        const result: SkillCooldownConfig = {};
        for (const event of ['onActivate', 'onDeactivate'] as const) {
            if (scaling[event] !== undefined) {
                result[event] = this.calculateConstrainedValue(scaling[event], context, 0, true);
            }
        }
        return result;
    }

    /** Calcula costes no negativos. En upkeep, el coste inicial y el mantenimiento son independientes. */
    calculateManaCost(scaling: SkillManaCostScaling, context: SkillScalingContext): SkillManaCost {
        switch (scaling.type) {
            case 'none': return { type: 'none' };
            case 'instant':
                return { type: 'instant', amount: this.calculateConstrainedValue(scaling.amount, context, 0) };
            case 'upkeep':
                return {
                    type: 'upkeep',
                    ...(scaling.initialAmount === undefined ? {} : {
                        initialAmount: this.calculateConstrainedValue(scaling.initialAmount, context, 0),
                    }),
                    amountPerTurn: this.calculateConstrainedValue(scaling.amountPerTurn, context, 0),
                };
            default: throw new Error('Tipo de coste de maná no soportado');
        }
    }

    /** Devuelve turnos enteros >= 1 o mantiene la duración until_no_mana sin convertirla a turnos. */
    calculateDuration(scaling: SkillDurationScaling, context: SkillScalingContext): DurationConfig {
        switch (scaling.type) {
            case 'until_no_mana': return { type: 'until_no_mana' };
            case 'turns':
                return { type: 'turns', turns: this.calculateConstrainedValue(scaling.turns, context, 1, true) };
            default: throw new Error('Tipo de duración no soportado');
        }
    }

    /** Calcula ambos extremos no negativos; rechaza rangos invertidos en lugar de intercambiarlos. */
    calculateRange(scaling: SkillRangeScaling, context: SkillScalingContext): { min: number; max: number } {
        const min = this.calculateConstrainedValue(scaling.min, context, 0);
        const max = this.calculateConstrainedValue(scaling.max, context, 0);
        if (min > max) throw new Error('El mínimo calculado de la skill supera al máximo');
        return { min, max };
    }

    /** Genera modificadores nuevos y deriva bonusRefKey del destino; admite penalizaciones negativas. */
    calculateStatModifiers(scalings: readonly SkillStatModifierScaling[], context: SkillScalingContext): StatsModifiers[] {
        return scalings.map(scaling => {
            if (!['flat', 'increased', 'reduced'].includes(scaling.operation)) {
                throw new Error('Operación de modificador de stats no soportada');
            }
            return {
                target: scaling.target,
                // RoutStatKey restringe el último segmento a una BonusRefKey.
                bonusRefKey: scaling.target.slice(scaling.target.lastIndexOf('.') + 1) as BonusRefKeys,
                operation: scaling.operation,
                value: this.calculateValue(scaling.value, context),
            };
        });
    }

    /**
     * Combina límites de dominio con los configurados, aplicando siempre los más restrictivos.
     * @param integer Si es true, fuerza precisión cero mediante truncado hacia cero.
     * @param max Tope opcional de dominio; usar 100 para probabilidades, no para pesos.
     */
    calculateConstrainedValue(scaling: SkillValueScaling, context: SkillScalingContext, min: number,
        integer = false, max?: number): number {
        return this.calculateValue({
            ...scaling,
            min: Math.max(scaling.min ?? min, min),
            ...(max === undefined ? {} : { max: Math.min(scaling.max ?? max, max) }),
            ...(integer ? { precision: 0 } : {}),
        }, context);
    }

    /** Lee lvPoints + bonusPoints o una ruta numérica de stats, sin recalcular ni aplicar caps al personaje. */
    private readSource(source: SkillScalingSource, context: SkillScalingContext): number {
        switch (source.type) {
            case 'attribute': {
                const attribute = context.attributes?.[source.attribute];
                if (!attribute) throw new Error(`Faltan atributos para escalar ${source.attribute}`);
                return this.finite(attribute.lvPoints, 'lvPoints') + this.finite(attribute.bonusPoints, 'bonusPoints');
            }
            case 'stat': {
                let value: unknown = context.stats;
                for (const segment of source.path.split('.')) {
                    if (!value || typeof value !== 'object' || !Object.hasOwn(value, segment)) {
                        throw new Error(`No existe la stat numérica ${source.path}`);
                    }
                    value = (value as Record<string, unknown>)[segment];
                }
                if (typeof value !== 'number') throw new Error(`La stat ${source.path} no es numérica`);
                return this.finite(value, source.path);
            }
            default: throw new Error('Fuente de escalado no soportada');
        }
    }

    /** Limita y después trunca; rechaza límites incompatibles con la precisión y normaliza -0 a 0. */
    private normalize(value: number, scaling: SkillValueScaling): number {
        this.finite(value, 'scaling result');
        const min = scaling.min === undefined ? undefined : this.finite(scaling.min, 'min');
        const max = scaling.max === undefined ? undefined : this.finite(scaling.max, 'max');
        if (min !== undefined && max !== undefined && min > max) throw new Error('Límites de escalado invertidos');
        if (min !== undefined) value = Math.max(min, value);
        if (max !== undefined) value = Math.min(max, value);
        if (scaling.precision !== undefined) {
            const precision = scaling.precision;
            if (!Number.isInteger(precision) || precision < 0 || precision > 15) {
                throw new Error('La precisión debe ser un entero entre 0 y 15');
            }
            const factor = 10 ** precision;
            value = Math.trunc(this.finite(value * factor, 'precision result')) / factor;
            if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
                throw new Error('Los límites del escalado son incompatibles con su precisión');
            }
        }
        return value === 0 ? 0 : value;
    }

    /** Valida máximos por rango y niveles enteros desde 1; P no requiere subnivel. */
    private validateProgression(point: SkillProgressionPoint, limits: SkillProgressionLimits): void {
        for (const rank of LEVELED_RANKS) {
            if (!Number.isSafeInteger(limits.maxLevelByRank[rank]) || limits.maxLevelByRank[rank] < 1) {
                throw new Error(`Límite de niveles inválido para ${rank}`);
            }
        }
        if (!point || !Object.hasOwn(MASTERY_ORDER, point.rank)) throw new Error('Maestría de skill inválida');
        if (point.rank !== 'P' && (!Number.isSafeInteger(point.level) || point.level < 1
            || point.level > limits.maxLevelByRank[point.rank])) {
            throw new Error(`Nivel inválido para la maestría ${point.rank}`);
        }
    }

    /** Compara primero N < M < G < P y luego el nivel dentro del mismo rango. */
    private compare(left: SkillProgressionPoint, right: SkillProgressionPoint): number {
        const rankDifference = MASTERY_ORDER[left.rank] - MASTERY_ORDER[right.rank];
        if (rankDifference !== 0) return rankDifference;
        if (left.rank === 'P' || right.rank === 'P') return 0;
        return left.level - right.level;
    }

    private finite(value: number, label: string): number {
        if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Valor no finito en ${label}`);
        return value;
    }
}
