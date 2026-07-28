import { Injectable } from "@nestjs/common";
import { SkillCooldownReductionResult } from "../../types/fighter/cooldown.types";
import { TurnContext } from "../../types/fight/fight-context.types";

@Injectable()
export class CooldownProcessorService {
    processTurnStart(context: TurnContext): SkillCooldownReductionResult[] {
        const results = context.actor.reduceSkillCooldowns();

        for (const result of results) {
            context.events.push({
                type: 'skill_cooldown_reduced',
                fighterId: context.actor.id,
                skillId: result.skillId,
                initialTurns:result.initialTurns,
                previousTurns:result.previousTurns,
                remainingTurns:result.remainingTurns
            });

            if (result.finished) {
                context.events.push({
                    type: 'skill_cooldown_finished',
                    fighterId:context.actor.id,
                    skillId: result.skillId
                });
            }
        }

        return results;
    }
}