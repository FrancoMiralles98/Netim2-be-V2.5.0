import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { CastAuraAction, CastBuffAction, CombatAction, UseDamageSkillAction, UseHealingSkillAction } from "../../types/combatAction/combat-action.types";
import { HEALING_SKILL_HP_THRESHOLD_PERCENT } from "../../config/skill-healing.config";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { SkillType } from "netim2-shared";

@Injectable()
export class CombatActionSelectorService {
    select(context: TurnContext): CombatAction {
        const healingAction = this.selectAvailableHealingSkill(context)
        if (healingAction) {
            return healingAction
        }
        const auraAction = this.selectAvailableAura(context)
        if (auraAction) {
            return auraAction
        }
        const buffAction = this.selectAvailableBuff(context)
        if (buffAction) {
            return buffAction
        }
        const skillAction = this.selectAvailableDamageSkill(context)
        if (skillAction) {
            return skillAction
        }

        return {
            type: 'basic_attack',
            targetId: context.fight.getSingleOpponentOf(context.actor.id).id,
        }
    }

    private selectAvailableAura(ctx: TurnContext): CastAuraAction | undefined {
        const allAuras = ctx.actor.getSkillsAura()
        for (const aura of allAuras) {
            if (ctx.actor.hasActiveAuraBySkillId(aura.id)) continue
            if (!this.canUseSkill(ctx.actor, aura)) continue
            return {
                type: 'cast_aura',
                skillId: aura.id
            }
        }
        return undefined
    }

    private selectAvailableBuff(ctx: TurnContext): CastBuffAction | undefined {
        const allBuffs = ctx.actor.getSkillsBuff()
        for (const buff of allBuffs) {
            if (ctx.actor.hasActiveBuffBySkillId(buff.id)) continue
            if (!this.canUseSkill(ctx.actor, buff)) continue
            return {
                type: 'cast_buff',
                skillId: buff.id,
                targetId: ctx.actor.id
            }
        }
        return undefined
    }

    private selectAvailableHealingSkill(ctx: TurnContext): UseHealingSkillAction | undefined {
        if (ctx.actor.getHpPercentage() > HEALING_SKILL_HP_THRESHOLD_PERCENT) {
            return undefined
        }
        const allHealingSkills = ctx.actor.getSkillsHeal()
        for (const skill of allHealingSkills) {
            if (!this.canUseSkill(ctx.actor, skill)) continue
            return {
                skillId: skill.id,
                targetId: ctx.actor.id,
                type: 'use_healing_skill'
            }
        }
        return undefined
    }

    private selectAvailableDamageSkill(ctx: TurnContext): UseDamageSkillAction | undefined {
        const allSkillDamage = ctx.actor.getSkillsDamage()

        for (const skill of allSkillDamage) {
            if (!this.canUseSkill(ctx.actor, skill)) continue
            const opponent = ctx.fight.getSingleOpponentOf(ctx.actor.id).id
            return {
                skillId: skill.id,
                targetId: opponent,
                type: 'use_damage_skill'
            }
        }
        return undefined
    }

    private canUseSkill(actor: FighterCombatEntity, skill: SkillType): boolean {
        if (actor.isSkillOnCooldown(skill.id)) {
            return false;
        }

        if (skill.mana.type === 'none') return true

        const initialManaCost = skill.mana.type === 'instant'
            ? skill.mana.amount
            : skill.mana.initialAmount ?? 0

        return actor.hasEnoughMana(initialManaCost);
    }
}