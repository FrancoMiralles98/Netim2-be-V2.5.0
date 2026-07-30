import { Injectable } from "@nestjs/common";
import { CombatAction } from "../../types/combatAction/combat-action.types";
import { TurnContext } from "../../types/fight/fight-context.types";
import { ActionResolution } from "../../types/actionResolution/action-resolution.types";
import { AuraActionResolverService } from "../resolvers/aura-action-resolver.service";

@Injectable()
export class ActionResolutionService {
    constructor(
        private auraActionResolver: AuraActionResolverService
    ) {}

    resolve(action: CombatAction, context: TurnContext): ActionResolution {
        switch (action.type) {
            case 'cast_aura':
                return this.auraActionResolver.resolve({action,context})
            case 'cast_buff':
                
            default:
                return this.assertNever(action)
        }
    }

    private assertNever(value: never): never {
        throw new Error(
            `Unsupported combat action: ${JSON.stringify(value)}`
        );
    }
}