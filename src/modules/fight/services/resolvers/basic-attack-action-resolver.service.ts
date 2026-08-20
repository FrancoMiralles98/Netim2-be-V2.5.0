import { Injectable } from "@nestjs/common";
import { BasicAttackActionResolution, BasicAttackHitResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { BasicAttackAction } from "../../types/combatAction/combat-action.types";
import { RngService } from "src/modules/shared/services/rng.service";
import { BasicAttackHitResolverService } from "./basic-attack-hit-resolver.service";
import { StatusEffectApplicationResolverService } from "./status-effect-application-resolver.service";
import { AppliedStatusEffectResolution } from "./dama-skill-action-resolver.types";
import { ContextualBonusService } from "../contextual-bonus.service";
import { LifeStealResolverService } from "./life-steal-resolver.service";
import { HealingResolution } from "./healing-resolver.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FightEntity } from "../../entities/fight.entity";

@Injectable()
export class BasicAttackActionResolverService {
    constructor(
        private basicAttackHitResolver: BasicAttackHitResolverService,
        private statusEffectsApplicationResolver: StatusEffectApplicationResolverService,
        private contextualBonusSerivce: ContextualBonusService,
        private lifeStealResolverService: LifeStealResolverService,
        private rngService: RngService
    ) { }

    resolve(
        { action, context }: ResolveActionInput<BasicAttackAction>
    ): BasicAttackActionResolution {

        console.log(context.actor.name, context.actor.getAllStatModifiers())
        const attackSequence = this.resolveAttackSequence(
            context.actor.effectiveStats.general.va)

        const target = context.fight.getFighter(action.targetId)

        /**
         * Registro en estadisticas que se aplico doble basico ?
         */

        const hits: BasicAttackHitResolution[] = [];
        const statusEffects: AppliedStatusEffectResolution[] = []

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        for (let index = 0; index < attackSequence.hitCount; index++) {
            if (!target.isAlive()) {
                break;
            }

            const hitResult = this.basicAttackHitResolver.resolveHit({
                attacker: context.actor,
                target,
                missChance: attackSequence.missChance,
                hitIndex: index
            })

            hits.push(hitResult)

            totalBaseDamage += hitResult.baseDamage;
            totalModifiedDamage += hitResult.modifiedDamage;
            totalMitigatedDamage += hitResult.mitigatedDamage;
            totalAppliedDamage += hitResult.appliedDamage;

            if (target.isAlive()) {
                const hitStatusEffects = this.statusEffectsApplicationResolver.resolveEffects({
                    appliedOnTurn: context.turnNumber,
                    source: context.actor,
                    effect: this.contextualBonusSerivce.getBasicAttackStatusEffectsChances(context.actor),
                    target,
                    triggeringDamage: hitResult.baseDamage,
                    isCritic: hitResult.critical
                })
                statusEffects.push(...hitStatusEffects)
            }
        }

        const lifeStealResult = this.lifeStealResolverService.resolveBasicAttackLifeSteal({
            attacker: context.actor,
            damageDealt: totalAppliedDamage,
            target,
        })

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

        const extraAttackTriggered = this.rngService.rollChance(attackSpeed);

        return {
            hitCount: extraAttackTriggered ? 2 : 1,
            missChance: 0,
            extraAttackTriggered
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