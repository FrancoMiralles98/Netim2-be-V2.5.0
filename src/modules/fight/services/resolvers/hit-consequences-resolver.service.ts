import { Injectable } from '@nestjs/common';
import type { SkillDamage } from 'netim2-shared';
import type { CombatHitResult, CombatHitSource } from 'netim2-shared';
import { FighterCombatEntity } from '../../entities/fighter-combat.entity';
import { TurnContext } from '../../types/fight/fight-context.types';
import { ContextualBonusService } from '../contextual-bonus.service';
import { LifeStealResolverService } from './life-steal-resolver.service';
import { HealingResolution } from './healing-resolver.types';
import { DamageResolutionResult } from './damage-resolver.types';
import { StatusEffectApplicationResolverService } from './status-effect-application-resolver.service';
import { ReflectionResolverService } from './reflection-resolver.service';
import { DamageResolverService } from './damage-resolver.service';

/** Coordina estados, explosión, curación y reflejo de un golpe ya resuelto. */
@Injectable()
export class HitConsequencesResolverService {
    constructor(
        private readonly effects: StatusEffectApplicationResolverService,
        private readonly bonuses: ContextualBonusService,
        private readonly lifeSteal: LifeStealResolverService,
        private readonly reflection: ReflectionResolverService,
        private readonly damage: DamageResolverService,
    ) {}

    /** La curación y el reflejo usan solo daño directo; los procs no generan recursión. */
    resolve(input: {
        context: TurnContext; target: FighterCombatEntity; skill?: SkillDamage;
        hit: Pick<CombatHitResult, 'hitIndex' | 'outcome' | 'critical' | 'penetrating' | 'components'>;
        directDamage: number; baseDamage: number; targetHpBefore: number;
    }) {
        const { context, target, skill } = input;
        const actor = context.actor;
        const attackerHpBefore = actor.getCurrentHp();
        const source: CombatHitSource = skill ? { type: 'skill', skillId: skill.id } : { type: 'basic_attack' };
        const statusEffects = input.hit.outcome === 'hit' && target.isAlive()
            ? this.effects.resolveEffects({ source: actor, target, context, appliedOnTurn: context.turnNumber,
                effect: skill ? skill.statusEffects : this.bonuses.getBasicAttackStatusEffectsChances(actor),
                triggeringDamage: input.baseDamage, isCritic: input.hit.critical })
            : [];
        const healing = skill
            ? this.lifeSteal.resolveSkillLifeSteal({ attacker: actor, target, damageDealt: input.directDamage, mechanicsEffects: skill.mechanicsEffects })
            : this.lifeSteal.resolveBasicAttackLifeSteal({ attacker: actor, target, damageDealt: input.directDamage });
        if (healing.effectiveHealing > 0) context.events.push({ type: 'healing_resolved',
            resolution: { appliedHealing: healing.effectiveHealing, critical: false, totalPrevented: healing.preventedAmount },
            targetCurrentHp: healing.hpAfter });

        const reflected = this.reflection.resolve({ attacker: actor, target, delivery: 'direct', receivedDamage: input.directDamage });
        let reflectedDamage: DamageResolutionResult | null = null;
        if (reflected) {
            reflectedDamage = this.damage.resolve({ attacker: reflected.source, target: reflected.target,
                damage: reflected.damage, damageType: reflected.damageType, sourceType: 'reflected', reflectedFromDamageType: 'true' });
            this.reflection.reflectionDmgResultRegister(reflected.source, reflectedDamage);
            context.events.push({ type: 'damage_resolved', critical: false, penetrating: false,
                source: { type: 'reflected', originalAttackerId: actor.id, sourceFighterId: target.id },
                resolution: { appliedDamage: reflectedDamage.effectiveDamage, damageType: 'true', delivery: 'reflected' },
                targetCurrentHp: reflectedDamage.hpAfter, targetDefeated: !actor.isAlive(), hitIndex: input.hit.hitIndex });
        }
        const additional = statusEffects.reduce((sum, effect) => sum + (effect.stackProc?.appliedDamage ?? 0), 0);
        const playback: CombatHitResult = {
            ...input.hit, source, attackerId: actor.id, targetId: target.id,
            damage: { direct: input.directDamage, additional, total: input.directDamage + additional },
            healing: { source: skill ? 'vampirismo_hechizo' : 'robo_vida', requestedHealing: healing.baseAmount,
                effectiveHealing: healing.effectiveHealing, preventedHealing: healing.preventedAmount,
                overhealing: healing.overhealing, hpBefore: healing.hpBefore, hpAfter: healing.hpAfter },
            reflectedDamage: reflectedDamage?.effectiveDamage ?? 0, statusEffects,
            attackerHpBefore, attackerHpAfter: actor.getCurrentHp(),
            targetHpBefore: input.targetHpBefore, targetHpAfter: target.getCurrentHp(),
            attackerDefeated: !actor.isAlive(), targetDefeated: !target.isAlive(),
        };
        return { playback, healing, reflectedDamage, statusEffects };
    }

    /** Suma resultados ya aplicados; no vuelve a curar ni a resolver daños. */
    summarize(results: { healing: HealingResolution; reflectedDamage: DamageResolutionResult | null }[]) {
        if (results.length === 0) throw new Error('La acción debe resolver al menos un hit');
        const heals = results.map(result => result.healing);
        const healing: HealingResolution = { ...heals[0],
            hpAfter: heals.at(-1)!.hpAfter,
            baseAmount: 0, amountBeforeReduction: 0, amountAfterReduction: 0,
            effectiveHealing: 0, preventedAmount: 0, overhealing: 0, reductions: [],
        };
        for (const heal of heals) {
            for (const key of ['baseAmount', 'amountBeforeReduction', 'amountAfterReduction', 'effectiveHealing', 'preventedAmount', 'overhealing'] as const) {
                healing[key] += heal[key];
            }
            healing.reductions.push(...heal.reductions);
        }
        healing.totalReductionPercentage = healing.amountBeforeReduction > 0 ? healing.preventedAmount / healing.amountBeforeReduction : 0;
        const reflections = results.flatMap(result => result.reflectedDamage ? [result.reflectedDamage] : []);
        let reflectedDmgResult: DamageResolutionResult | null = null;
        for (const reflected of reflections) {
            if (!reflectedDmgResult) reflectedDmgResult = { ...reflected };
            else {
                for (const key of ['requestedDamage', 'mitigatedAmount', 'damageAfterMitigation', 'effectiveDamage', 'overkillDamage'] as const) {
                    reflectedDmgResult[key] += reflected[key];
                }
                reflectedDmgResult.hpAfter = reflected.hpAfter;
            }
        }
        return { lifeStealResult: healing, reflectedDmgResult };
    }
}
