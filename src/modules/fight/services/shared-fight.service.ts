import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { SkillAura, SkillType } from "netim2-shared";

@Injectable()
export class SharedFightService {

    canUseSkill(actor: FighterCombatEntity, skill: SkillType): boolean {
        if (actor.isSkillOnCooldown(skill.id)) {
            return false;
        }

        if (skill.mana.type === 'none') return true

        const initialManaCost = skill.mana.type === 'instant'
            ? skill.mana.amount
            : skill.mana.initialAmount ?? 0

        return actor.hasEnoughMana(initialManaCost);
    }

    getInitialManaCost(skill: SkillType): number {
        switch (skill.mana.type) {
            case 'instant':
                return skill.mana.amount

            case 'upkeep':
                return skill.mana.initialAmount ?? 0
            default:
                throw new Error('No se puede obtener el costo de mana del aura')
        }
    }


}