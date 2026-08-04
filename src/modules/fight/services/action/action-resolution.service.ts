import { Injectable } from "@nestjs/common";
import { CombatAction } from "../../types/combatAction/combat-action.types";
import { TurnContext } from "../../types/fight/fight-context.types";
import { ActionResolution } from "../../types/actionResolution/action-resolution.types";
import { AuraActionResolverService } from "../resolvers/aura-action-resolver.service";
import { BuffActionResolver } from "../resolvers/buff-action-resolver.service";
import { HealingSkillActionResolverService } from "../resolvers/healing-skill-action-resolver.service";
import { DamageSkillActionResolver } from "../resolvers/damage-skill-action-resolver.service";

@Injectable()
export class ActionResolutionService {
    constructor(
        private auraActionResolver: AuraActionResolverService,
        private buffActionResolver: BuffActionResolver,
        private healingSkillActionResolver: HealingSkillActionResolverService,
        private damageSkillActionResolver: DamageSkillActionResolver,
    ) { }

    resolve(action: CombatAction, context: TurnContext): ActionResolution {
        switch (action.type) {
            case 'cast_aura':
                return this.auraActionResolver.resolve({ action, context })
            case 'cast_buff':
                return this.buffActionResolver.resolve({ action, context })
            case 'use_healing_skill':
                return this.healingSkillActionResolver.resolve({ action, context })
            case 'use_damage_skill':
                return this.damageSkillActionResolver.resolve({ action, context })
            case "basic_attack":
            case "skip_turn":
            default:
                return this.assertNever(action as never)
        }
    }

    private assertNever(value: never): never {
        throw new Error(
            `Unsupported combat action: ${JSON.stringify(value)}`
        );
    }
}