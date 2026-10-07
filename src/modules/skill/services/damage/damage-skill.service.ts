import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SharedSkillService } from "../shared-skill.service";
import { Atributos, CharacterRace, CharacterSpeciality, SkillDamage, Stats } from "netim2-shared";
import { isSkillDamageScaling } from "../../types/skills.guards";
import { DamageCalculatorService } from "./damage-calculator.service";
import { EffectsCalculatorService } from "./effects-calculator.service";
import { ModifiersCalculatorService } from "./modifiers-calculator.service";
import { SkillDamageScaling } from "../../types/scaling/damage/skill-damage-scaling.type";

@Injectable()
export class DamageSkillService {

    constructor(
        private sharedSkillService: SharedSkillService,
        private damageCalculatorService: DamageCalculatorService,
        private effectsCalculatorService: EffectsCalculatorService,
        private modifiersCalculatorService: ModifiersCalculatorService,
    ) { }

    getUpdatedSkill(
        skill: SkillDamage,
        stats: Stats,
        race: CharacterRace,
        speciality: CharacterSpeciality,
        atributos: Atributos
    ): SkillDamage {
        const scalingSkillInfo = this.sharedSkillService.getSkillScalingInfo(skill.id, race, speciality)
        if (!isSkillDamageScaling(scalingSkillInfo)) {
            throw new InternalServerErrorException(`La skill ${skill.id} no posee una configuración de escalado de daño válida`)
        }
        return this.buildUpdatedSkill(skill, scalingSkillInfo, stats, atributos)
    }

    private buildUpdatedSkill(skill: SkillDamage, scaling: SkillDamageScaling, stats: Stats, atributos: Atributos): SkillDamage {
        const lvPoints = this.sharedSkillService.getPointsLvBonification(skill.lv)
        return {
            ...skill,
            cd: scaling.cd,
            components: this.damageCalculatorService.getDamage(skill, scaling, stats,atributos),
            mana: this.sharedSkillService.getManaCost(skill.mana, scaling, skill.lv),
            mechanicsEffects: this.effectsCalculatorService.getMechanicsEffects(lvPoints, scaling),
            statusEffects: this.effectsCalculatorService.getStatusEffects(lvPoints, scaling),
            damageModifiers: this.modifiersCalculatorService.getDamageModifier(skill, lvPoints, scaling),
            hitModifiers: this.modifiersCalculatorService.getHitModifier(skill, lvPoints, scaling),
        }
    }
}