import { Injectable } from "@nestjs/common";
import { SkillService } from "src/modules/skill/skill.service";
import { SharedFightService } from "./shared-fight.service";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { SkillDamage } from "netim2-shared";
import { PreparedSkillDamage } from "./damage-calculator.types";

@Injectable()
export class DamageCalculatorService {
    constructor(
        private skillService: SkillService,
        private sharedFightService: SharedFightService 
    ){}

    prepareSkillDamage(attacker:FighterCombatEntity,skill:SkillDamage):PreparedSkillDamage {
        const updatedSkill = this.skillService.getUpdatedSkill(
            structuredClone(skill),
            attacker,
            attacker.race,
            attacker.effectiveStats,
        )
    }

}