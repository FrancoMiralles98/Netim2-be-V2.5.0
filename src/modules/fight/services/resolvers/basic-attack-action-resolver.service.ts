import { Injectable } from "@nestjs/common";
import { BasicAttackActionResolution, BasicAttackHitResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { BasicAttackAction } from "../../types/combatAction/combat-action.types";
import { RngService } from "src/modules/shared/services/rng.service";
import { BasicAttackHitResolverService } from "./basic-attack-hit-resolver.service";
import { StatusEffectApplicationResolverService } from "./status-effect-application-resolver.service";
import { AppliedStatusEffectResolution } from "./dama-skill-action-resolver.types";
import { ContextualBonusService } from "../contextual-bonus.service";

@Injectable()
export class BasicAttackActionResolverService {
    constructor(
        private basicAttackHitResolver: BasicAttackHitResolverService,
        private statusEffectsApplicationResolver: StatusEffectApplicationResolverService,
        private contextualBonusSerivce: ContextualBonusService,
        private rngService: RngService
    ) { }

    resolve(
        { action, context }: ResolveActionInput<BasicAttackAction>
    ): BasicAttackActionResolution {

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
                })
                statusEffects.push(...hitStatusEffects)
            }
        }

        return {
            actorId: context.actor.id,
            extraAttackTriggered: attackSequence.extraAttackTriggered,
            hitCount: attackSequence.hitCount,
            hits,
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


}