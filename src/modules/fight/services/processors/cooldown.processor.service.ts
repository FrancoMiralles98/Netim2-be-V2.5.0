import { Injectable } from "@nestjs/common";
import { SkillCooldownReductionResult } from "../../types/fighter/cooldown.types";
import { TurnContext } from "../../types/fight/fight-context.types";
import { randomUUID } from "crypto";

@Injectable()
export class CooldownProcessorService {
    processTurnStart(context: TurnContext): SkillCooldownReductionResult[] {
        const results = context.actor.reduceSkillCooldowns();

        for (const result of results) {
            context.events.push({
                type: 'cooldown_updated',
                skillId: result.skillId,
                remainingTurns: result.remainingTurns,
            });
        }

        return results;
    }
}