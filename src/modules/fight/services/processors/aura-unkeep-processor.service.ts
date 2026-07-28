import { Injectable } from "@nestjs/common";
import { AuraManager } from "../../manager/aura-manager";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { TurnContext } from "../../types/fight/fight-context.types";
import { AuraUpkeepResult } from "./aura-unkeep-processor.types";

@Injectable()
export class AuraUnkeepProcessorService {
    constructor(private readonly auraManager: AuraManager
    ) { }

    process(owner: FighterCombatEntity,context: TurnContext): AuraUpkeepResult {
        const result: AuraUpkeepResult = {
            maintainedAuraIds: [],
            deactivatedAuraIds: [],
            manaSpent: 0
        };

        const activeAuras = owner.getActiveAuras();

        for (const aura of activeAuras) {
            if (!aura.isActive()) {
                continue;
            }

            /*
             * Seguridad: solamente se procesa el mantenimiento
             * de las auras cuyo dueño es el actor actual.
             */
            if ( aura.getSourceFighterId() !== owner.id) {
                continue;
            }

            const upkeepMana = aura.getUpkeepManaCost();

            /*
             * El aura no tiene mantenimiento de maná.
             */
            if (upkeepMana === 0) {
                result.maintainedAuraIds.push(aura.getInstanceId());
                continue;
            }

            /*
             * No puede mantener el aura.
             */
            if (!owner.hasEnoughMana(upkeepMana)) {
                this.auraManager.deactivate({aura,owner});

                result.deactivatedAuraIds.push(aura.getInstanceId());

                continue;
            }

            /*
             * Consume el maná de mantenimiento.
             */
            const manaSpent = owner.spendMana(upkeepMana);

            aura.registerManaPayment(manaSpent.amount);

            owner.statistics.registerResources({
                manaSpent: manaSpent.amount
            });

            result.manaSpent += manaSpent.amount;

            result.maintainedAuraIds.push(aura.getInstanceId());

            context.events.push({
                type: 'aura_upkeep_paid',
                turnNumber: context.turnNumber,
                fighterId: owner.id,
                auraInstanceId:
                    aura.getInstanceId(),
                skillId: aura.getSkillId(),
                manaSpent
            });
        }

        return result;
    }
}