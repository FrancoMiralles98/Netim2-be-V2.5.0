import { Injectable } from "@nestjs/common";
import { FightSkillService } from "./fight-skill.service";
import { FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { FightBasicAttackService } from "./fight-basic-attack.service";

@Injectable()
export class AttackerService {
    constructor(
        private fightSkillService: FightSkillService,
        private fightBasicAttackService: FightBasicAttackService
    ) { }

    executeCombatAction(
        attacker: FighterType,
        defender: FighterType,
    ): ActionAttackerType {

        const action =
            this.fightSkillService.tryToSelectSkill(
                attacker.fight_details.skills_used,
                attacker.hab,
                attacker.stats
            )
            || this.fightBasicAttackService.useBasicAttack(attacker.stats,attacker.effects)

        if (action.type_action === 'healing') {
            return action
        }

        return action.type_action === 'skill'
        ? this.fightSkillService.applyBonus(action,attacker,defender)
        : this.fightBasicAttackService.applyBonus(action,attacker,defender)
    }


}