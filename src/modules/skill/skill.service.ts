import { Injectable } from '@nestjs/common';
import { SkillType } from './types/skill.type';
import { AuraSkillType } from './types/aura-skill.type';
import { SkillAuraEscalado, SkillDamageEscalado } from './types/skill-scaling.type';
import { SKILL_SCALING_BY_RACE_CONFIG } from './config/skillScaling/skill-scaling-by-race.const';
import { CharacterRace, CharacterSpeciality, CharacterStats } from '../character/types/baseCharacterProps/character-stats.type';
import { UNIQUE_ID_SKILLS } from './types/unique-id-skill.enum';
import { DamageSkillService } from './services/damage-skill.service';
import { AuraSkillService } from './services/aura-skill.service';

@Injectable()
export class SkillService {

    constructor(
        private damageSkillService: DamageSkillService,
        private auraSkillService: AuraSkillService
    ) { }

    calculateSkillEffect(
        skill: SkillType,
        race: CharacterRace,
        speciality: CharacterSpeciality,
        statsGeneral: CharacterStats['general']
    ): SkillType {

        const skillScaling = this.getScalingSkill(race, speciality, skill.idSkill)

        if (this.isSkillAura(skill)) {
            if (!this.isAuraScaling(skillScaling)) {
                throw new Error(`El scaling de la skill ${skill.idSkill} no corresponde a una skill aura`);
            }
            return this.auraSkillService.updateAuraEffects(skill, skillScaling, statsGeneral);
        }

        if (!this.isDamageScaling(skillScaling)) {
            throw new Error(`El scaling de la skill ${skill.idSkill} no corresponde a una skill de daño`);
        }

        return this.damageSkillService.updateDamageSkillStats(skill, skillScaling, statsGeneral)
    }

    private getScalingSkill(
        race: CharacterRace,
        speciality: CharacterSpeciality,
        idSkill: UNIQUE_ID_SKILLS
    ): SkillDamageEscalado | SkillAuraEscalado {
        const raceScaling = SKILL_SCALING_BY_RACE_CONFIG[race]

        if (!raceScaling) {
            throw new Error(`No se encuentra los escalados de las skill de  raza${race}`)
        }

        const specialityScaling = raceScaling[speciality]

        if (!specialityScaling) {
            throw new Error(`No se encuentra los escalados de las skill de especialidad ${speciality}`)
        }

        const skillScaling = specialityScaling[idSkill]

        if (!skillScaling) {
            throw new Error(`No se encuentra los escalados de las skill de de idSkill ${idSkill}`)
        }

        return skillScaling
    }

    private isSkillAura(skill: SkillType): skill is AuraSkillType {
        return skill.type === 'Aura';
    }

    private isAuraScaling(scaling: SkillAuraEscalado | SkillDamageEscalado): scaling is SkillAuraEscalado {
        return scaling.type === 'aura'
    }

    private isDamageScaling(scaling: SkillAuraEscalado | SkillDamageEscalado): scaling is SkillDamageEscalado {
        return scaling.type === 'damage'
    }
}
