import { Injectable } from "@nestjs/common";
import { RngService } from "src/modules/shared/services/rng.service";
import { ContextualBonusService } from "../contextual-bonus.service";
import { PeriodicStatusEffectConfig, ResolveSkillEffectsInput, StatusEffectApplicationResult, StatusEffectConfig, StatusEffectDurationConfig } from "./status-effect-application-resolver.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { DamageCondition, RoutStatKey, StatsScaling } from "netim2-shared";
import { StatusEffectManager } from "../../manager/status-effect-manager";
import { STATUS_EFFECTS_CONFIG } from "../../config/status-effects.config";
import { ActiveStatusEffectData, PeriodicDamageEffectData } from "../../types/statusEffects/effect-data.types";
import { ActiveStatusEffectId } from "../../types/statusEffects/active-status-effect.types";

@Injectable()
export class StatusEffectApplicationResolverService {
    constructor(
        private readonly rngService: RngService,
        private readonly statusEffectManager: StatusEffectManager,
        private readonly contextualBonusService: ContextualBonusService
    ) { }


    resolveEffects(input: ResolveSkillEffectsInput): StatusEffectApplicationResult[] {
        const configuredEffects = input.effect;

        if (!configuredEffects) {
            return [];
        }

        const entries = Object.entries(configuredEffects) as Array<[ActiveStatusEffectId, number | undefined]>

        const results: StatusEffectApplicationResult[] = [];

        for (const [effectId, chance] of entries) {
            if (chance === undefined || chance <= 0) {
                continue;
            }
            const result = this.resolveSingleEffect({
                source: input.source,
                target: input.target,
                effectId, baseChance: chance,
                triggeringDamage: input.triggeringDamage,
                isCritic: input.isCritic,
                appliedOnTurn: input.appliedOnTurn
            });

            results.push(result);
        }

        this.statusEffectAplicationStatisticRegister(input.source, input.target, results)

        return results;
    }

    private resolveSingleEffect(input: {
        source: FighterCombatEntity;
        target: FighterCombatEntity;

        effectId: ActiveStatusEffectId;
        isCritic: boolean;
        baseChance: number;

        triggeringDamage: number;

        appliedOnTurn: number;
    }): StatusEffectApplicationResult {
        const config = structuredClone(STATUS_EFFECTS_CONFIG[input.effectId])

        if (!config) {
            throw new Error(`No se encontró la configuración del efecto ${input.effectId}.`);
        }

        const applicationSucceeded = this.rngService.rollChance(input.baseChance)

        if (!applicationSucceeded) {
            return {
                applied: false,
                resisted: false,
                baseChance: input.baseChance,
                effectId: input.effectId,
            }
        }

        let resistanceChance = 0

        if (config.resistible) {
            resistanceChance = this.contextualBonusService.getResistanceBonusByEffectId(
                input.target, input.effectId)

            const resisted = this.rngService.rollChance(resistanceChance)
            if (resisted) {
                return {
                    applied: false,
                    resisted: true,
                    baseChance: input.baseChance,
                    effectId: input.effectId,
                    resistanceChance
                }
            }
        }

        const duration = this.resolveDuration({
            source: input.source,
            effectId: input.effectId,
            config: config.duration
        });

        const data = this.createActiveStatusEffectData({
            source: input.source,
            target: input.target,
            triggeringDamage: input.triggeringDamage,
            config,
            isCritic: input.isCritic,
            effectId: input.effectId
        });

        const activeEffect = this.statusEffectManager.apply({
            source: input.source,
            target: input.target,
            effectId: input.effectId,
            appliedOnTurn: input.appliedOnTurn,
            canStackDuration: config.duration.canStackDuration,
            duration: {
                type: 'turns',
                turns: duration
            },
            data,
            modifiers: config.statsModifiers ?? [],
            stacks: config.type === 'periodic_damage'
                ? config.stacks
                : undefined
        });

        return {
            effectId:
                input.effectId,

            applied: true,
            resisted: false,

            baseChance:
                input.baseChance,

            instanceId:
                activeEffect.getInstanceId(),

            remainingTurns:
                activeEffect.getRemainingTurns(),

            stacks:
                activeEffect.getStacks()
                    ?.current
        };
    }


    private resolveDuration(input: {
        source: FighterCombatEntity;
        effectId: ActiveStatusEffectId;
        config: StatusEffectDurationConfig;
    }): number {
        let totalBonusDuration = 0;

        input.config.bonusTarget.forEach(route => {
            totalBonusDuration += input.source.getEffectiveStatValue(route) ?? 0;
        });

        const calculatedTurns = Math.floor(input.config.baseTurns * (1 + totalBonusDuration / 100));

        const value = input.config.maxTurns !== undefined
            ? Math.min(calculatedTurns, input.config.maxTurns)
            : calculatedTurns;

        return Math.max(1, value);
    }

    private createActiveStatusEffectData(input: {
        source: FighterCombatEntity;
        target: FighterCombatEntity;
        effectId: ActiveStatusEffectId
        triggeringDamage: number;
        isCritic: boolean;
        config: StatusEffectConfig;
    }): ActiveStatusEffectData {
        switch (input.config.type) {
            case 'periodic_damage':
                return this.createPeriodicDamageData({
                    source: input.source,
                    target: input.target,
                    triggeringDamage: input.triggeringDamage,
                    isCritic: input.isCritic,
                    config: input.config,
                    effectId: input.effectId
                });
            case 'control':
                return {
                    effectId: 'desmayo',
                    type: 'control'
                };
            case 'stat_modifier':
                return {
                    effectId: 'retardo',
                    type: 'stat_modifier'
                };
            case "healing_reduction":
                return {
                    type: 'healing_reduction',
                    healReductionPorcent: input.config.reductionPercent,
                    effectId: 'corta_curacion'
                }

            default:
                throw new Error(`No se encuentra supporteado el createActiveStatusEffectData`);
        }
    }

    private createPeriodicDamageData(input: {
        source: FighterCombatEntity,
        target: FighterCombatEntity,
        triggeringDamage: number,
        isCritic: boolean;
        effectId: ActiveStatusEffectId,
        config: PeriodicStatusEffectConfig
    }): PeriodicDamageEffectData {
        let baseDamage = input.triggeringDamage * input.config.baseDamageRatio
        if (input.isCritic) {
            baseDamage *= input.source.getEffectiveStatValue('bonus.daño.daño_critico')
        }
        const damageFromCondition = this.calculateConditionalBonusDamage({
            source: input.source,
            target: input.target,
            triggeringDamage: baseDamage,
            conditionConfig: input.config.bonusDamageCondition
        });

        const damageFromTargetStats = this.calculateTargetStatsScalingDamage({
            target: input.target,
            baseDamage,
            statsScaling: input.config.statsScaling
        });


        const damageBonusPercent = this.calculateStatusEffectDamageBonus({
            source: input.source,
            bonusTargets: input.config.damageBonusTarget
        });

        const damageBeforeBonus = baseDamage + damageFromCondition + damageFromTargetStats

        const baseTickDamage = Math.max(0,
            Math.floor(damageBeforeBonus * (1 + damageBonusPercent / 100))
        );

        switch (input.config.effectId) {
            case 'electrico':
                return {
                    type: 'periodic_damage',
                    effectId: 'electrico',
                    damagePerTick: baseTickDamage,
                    extraDamageToApplyStacks: input.config.extraDamageRatioPerStackThreshold
                }
            case 'veneno':
                return {
                    type: 'periodic_damage',
                    effectId: 'veneno',
                    damagePerTick: baseTickDamage,
                    healReductionPorcent: input.config.healReduction
                }
            case 'incendio':
                return {
                    type: 'periodic_damage',
                    effectId: 'incendio',
                    damagePerTick: baseTickDamage,
                    refreshOptions: {
                        refreshExtraBonusDamageAvailable: true,
                        refreshExtraBonusRatio: input.config.extraDamageRatioPerRefresh
                    }
                }
            case 'sangrado':
                return {
                    type: 'periodic_damage',
                    effectId: 'sangrado',
                    damagePerTick: baseTickDamage,
                    extraDamagePerMovementSpeed: input.config.damagePerMovementSpeedPoint
                }
            default:
                throw new Error(`No se encuentra supporteado el createPeriodicDamageData`);
        }

    }

    private calculateConditionalBonusDamage(input: {
        source: FighterCombatEntity;
        target: FighterCombatEntity;
        triggeringDamage: number;
        conditionConfig?: PeriodicStatusEffectConfig['bonusDamageCondition'];
    }): number {
        if (!input.conditionConfig) {
            return 0;
        }

        const conditionMet = this.matchesDamageCondition({
            source: input.source,
            target: input.target,
            condition: input.conditionConfig.condition
        });

        if (!conditionMet) {
            return 0;
        }

        console.log('triggeringDamage', input.triggeringDamage);


        return (
            input.triggeringDamage * input.conditionConfig.bonusDamageRatio
        );
    }

    private matchesDamageCondition(input: {
        source: FighterCombatEntity;
        target: FighterCombatEntity;
        condition: DamageCondition;
    }): boolean {
        switch (input.condition.type) {
            case 'target_has_effect':
                return input.target.hasActiveStatusEffect(
                    input.condition.effectId
                );

            case 'source_has_effect':
                return input.source.hasActiveStatusEffect(
                    input.condition.effectId
                );
            default:
                throw new Error(`No se encuentra supporteado el mathCondition`);
        }
    }

    private calculateTargetStatsScalingDamage(input: {
        target: FighterCombatEntity;
        baseDamage: number;
        statsScaling?: readonly StatsScaling[];
    }): number {
        if (!input.statsScaling?.length) {
            return 0;
        }

        return input.statsScaling.reduce((total, scaling) => {
            const statValue = input.target.getEffectiveStatValue(scaling.target);

            const normalizedStat = Math.max(0, statValue);

            const power = scaling.power ?? 1;

            /*
             * Determina cuánto % extra aporta
             * la stat.
             */
            const bonusPercent = Math.pow(normalizedStat, power) * scaling.ratio;
            console.log('porcentage de boni', bonusPercent);

            /*
             * Ese porcentaje se aplica sobre
             * el daño propio del efecto.
             */
            const bonusDamage = input.baseDamage * (bonusPercent / 100);

            return total + bonusDamage;
        },
            0
        );
    }

    private calculateStatusEffectDamageBonus(input: {
        source: FighterCombatEntity;
        bonusTargets?: readonly RoutStatKey[];
    }): number {
        if (!input.bonusTargets?.length) {
            return 0;
        }

        return input.bonusTargets.reduce((total, target) => {
            return (
                total +
                input.source.getEffectiveStatValue(target)
            );
        },
            0
        );
    }

    private statusEffectAplicationStatisticRegister(
        actor: FighterCombatEntity,
        target: FighterCombatEntity,
        results: StatusEffectApplicationResult[]
    ) {
        results.forEach(result => {
            actor.statistics.registerEffects({
                appliedByType: {
                    [result.effectId]: result.applied ? 1 : 0
                }
            })
            target.statistics.registerEffects({
                receivedByType: {
                    [result.effectId]: result.applied ? 1 : 0,
                },
                resistedByType: {
                    [result.effectId]: result.resisted ? 1 : 0
                }
            })
        })
    }
}