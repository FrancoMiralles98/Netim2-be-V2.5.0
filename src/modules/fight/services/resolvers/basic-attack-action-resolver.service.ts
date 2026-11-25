import { Injectable } from "@nestjs/common";
import { BasicAttackActionResolution, BasicAttackHitResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { RngService } from "src/modules/shared/services/rng.service";
import { BasicAttackHitResolverService } from "./basic-attack-hit-resolver.service";
import { AppliedStatusEffectResolution } from "./dama-skill-action-resolver.types";
import { HealingResolution } from "./healing-resolver.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FightEntity } from "../../entities/fight.entity";
import { BasicAttackAction } from "netim2-shared";
import { HitConsequencesResolverService } from './hit-consequences-resolver.service';
import type { CombatHitResult } from 'netim2-shared';

@Injectable()
export class BasicAttackActionResolverService {
    constructor(
        private basicAttackHitResolver: BasicAttackHitResolverService,
        private readonly consequences: HitConsequencesResolverService,
        private rngService: RngService
    ) { }

    /** Resuelve cada golpe y sus consecuencias antes de continuar la secuencia. */
    resolve(
        { action, context }: ResolveActionInput<BasicAttackAction>
    ): BasicAttackActionResolution {

        const attackSequence = this.resolveAttackSequence(
            context.actor.effectiveStats.general.va)

        const target = context.fight.getFighter(action.targetId)

        const hits: BasicAttackHitResolution[] = [];
        const hitResults: CombatHitResult[] = [];
        const consequences: ReturnType<HitConsequencesResolverService['resolve']>[] = [];
        const statusEffects: AppliedStatusEffectResolution[] = []

        let totalAppliedDamage = 0;

        if (attackSequence.hitCount > 1) {
            context.events.push({
                type: 'double_hit_triggered',
                generatedHitCount: attackSequence.hitCount,
            })
        }

        for (let index = 0; index < attackSequence.hitCount; index++) {
            if (!target.isAlive() || !context.actor.isAlive()) {
                break;
            }

            const hitResult = this.basicAttackHitResolver.resolveHit({
                attacker: context.actor,
                target,
                context,
                missChance: attackSequence.missChance,
                hitIndex: index
            })

            hits.push(hitResult)

            totalAppliedDamage += hitResult.appliedDamage;

            const result = this.consequences.resolve({
                context, target, directDamage: hitResult.appliedDamage, baseDamage: hitResult.baseDamage,
                targetHpBefore: hitResult.hpBefore,
                hit: { hitIndex: index, outcome: hitResult.outcome === 'applied' ? 'hit' : hitResult.outcome,
                    critical: hitResult.critical, penetrating: hitResult.penetration,
                    components: [{ componentIndex: 0, damageType: 'ad', appliedDamage: hitResult.appliedDamage }] },
            });
            consequences.push(result);
            hitResults.push(result.playback);
            statusEffects.push(...result.statusEffects);
        }

        const { lifeStealResult, reflectedDmgResult } = this.consequences.summarize(consequences);

        this.BasicAttackActionStatisticRegister(
            context.actor,
            context.fight,
            hits,
            lifeStealResult,
            attackSequence.extraAttackTriggered,
            target
        )

        return {
            actorId: context.actor.id,
            extraAttackTriggered: attackSequence.extraAttackTriggered,
            hitCount: attackSequence.hitCount,
            hits,
            hitResults,
            modifiers: {
                plannedHitCount: attackSequence.hitCount, executedHitCount: hits.length,
                damageMultiplierPerHit: 1, damageModifierApplied: false,
            },
            reflectedDmgResult,
            lifeSteal: lifeStealResult,
            success: true,
            statusEffects,
            targetDefeated: !target.isAlive(),
            targetId: target.id,
            totalDamageApplied: totalAppliedDamage,
            type: 'basic_attack'
        }
    }

    private resolveAttackSequence(
        attackSpeed: number
    ): { hitCount: number, missChance: number, extraAttackTriggered: boolean } {
        if (attackSpeed < 0) {
            return {
                hitCount: 1,
                missChance: Math.abs(attackSpeed),
                extraAttackTriggered: false
            };
        }

        // Cada 100 VA garantiza un ataque adicional; el resto se sortea una sola vez.
        const guaranteedExtraAttacks = Math.floor(attackSpeed / 100);
        const remainingChance = attackSpeed % 100;
        const rolledExtraAttack = remainingChance > 0 && this.rngService.rollChance(remainingChance);
        const extraAttacks = guaranteedExtraAttacks + (rolledExtraAttack ? 1 : 0);

        return {
            hitCount: 1 + extraAttacks,
            missChance: 0,
            extraAttackTriggered: extraAttacks > 0
        };
    }

    private BasicAttackActionStatisticRegister(
        actor: FighterCombatEntity,
        fight: FightEntity,
        hits: BasicAttackHitResolution[],
        lifeStealResult: HealingResolution,
        extraAttackTriggered: boolean,
        target: FighterCombatEntity
    ) {

        actor.statistics.registerHealing({
            type: 'basic_attack',
            amount: lifeStealResult.effectiveHealing
        })

        actor.statistics.registerAttackHits({
            doubleHitTriggered: extraAttackTriggered,
            hits: [] //no se pone nada porque luego por hit se pondran las estadisticas
        })

        hits.forEach(hit => {
            actor.statistics.registerDamageDealt({
                source: { type: 'basic_attack' },
                amount: hit.appliedDamage,
                damageType: 'ad',
                delivery: 'direct'
            })
            actor.statistics.registerAttackHits({
                doubleHitTriggered: false, //se pone false porque ya se registro el doubleHitTriggered
                hits: [{
                    result: hit.outcome === 'missed' ? 'missed' : 'successful',
                    critical: hit.critical,
                    penetrating: hit.penetration,
                }]
            })
            actor.statistics.registerBasicAttackUsed()

            target.statistics.registerDefensiveHit({
                blockType: 'full',
                result: hit.dodged === true
                    ? 'dodged'
                    : hit.blocked === true
                        ? 'blocked'
                        : 'received'
            })
            target.statistics.registerDamageMitigated({
                amount: hit.mitigatedDamage,
                damageType: 'ad'
            })
        })

        lifeStealResult.reductions.forEach(reductionDetail => {
            const fighter = fight.getFighter(reductionDetail.sourceFighterId)
            fighter.statistics.registerHealing({
                type: 'prevented',
                amount: reductionDetail.preventedAmount
            })
        })
    }

}
