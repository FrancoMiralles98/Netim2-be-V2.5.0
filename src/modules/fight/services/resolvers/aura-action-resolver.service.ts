import { Injectable } from "@nestjs/common";
import { AuraActionResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { SharedFightService } from "../shared-fight.service";
import { CastAuraAction, SkillAura } from "netim2-shared";
import { AuraStatModifierInput } from "../../types/auraManager/auraManager.types";
import { AuraManager } from "../../manager/aura-manager";

@Injectable()
export class AuraActionResolverService {
    constructor(
        private sharedFightService: SharedFightService,
        private auraManager: AuraManager
    ) { }

    resolve({ action, context }: ResolveActionInput<CastAuraAction>): AuraActionResolution {
        const skill = context.actor.getSkillById(action.skillId)
        if (!this.sharedFightService.canUseSkill(context.actor, skill)) {
            throw new Error('This actor cant use this skill.')
        }
        if (skill.type !== 'aura') {
            throw new Error('La skill tiene que ser una aura')
        }
        if (context.actor.hasActiveAuraBySkillId(skill.id)) {
            throw new Error('No puede usar un aura que ya esta activado')
        }

        const manaSpent = context.actor.spendMana(this.sharedFightService.getInitialManaCost(skill))

        const aura = this.auraManager.activate({
            skill,
            activatedOnTurn: context.turnNumber,
            modifiers: this.createAuraStatModifierInput(skill),
            source: context.actor
        })


        if (skill.cd.onActivate) {
            context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
        }

        context.actor.statistics.registerResources({
            manaSpent: manaSpent.amount
        })

        return {
            actorId: context.actor.id,
            skillId: aura.getSkillId(),
            type: 'cast_aura',
            success: true,
            auraInstanceId: aura.getInstanceId(),
            manaSpent: manaSpent.amount,
            remainingMana: manaSpent.manaAfter,
            cooldownRemainingTurns: context.actor.getSkillRemainingCooldown(skill.id),
            remainingDuration: aura.getDuration.getRemainingTurns(),
        }
    }

    private createAuraStatModifierInput(aura: SkillAura,): AuraStatModifierInput[] {
        return aura.statsModifiers.map(buff => ({
            operation: buff.operation,
            target: buff.target,
            value: buff.value
        }))
    }
}