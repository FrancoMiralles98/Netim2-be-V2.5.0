import { Injectable } from "@nestjs/common";
import { BasicAttackActionResolution, BasicAttackHitResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { BasicAttackAction } from "../../types/combatAction/combat-action.types";
import { SharedFightService } from "../shared-fight.service";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class BasicAttackActionResolverService {
    constructor(
        private sharedFightService: SharedFightService,
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

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        for (let index = 0; index < attackSequence.hitCount; index++) {
            if (!target.isAlive()) {
                break;
            }
            
            
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
            hitCount: extraAttackTriggered
                ? 2
                : 1,
            missChance: 0,
            extraAttackTriggered
        };
    }
}