import { Injectable } from '@nestjs/common';
import { SkillType } from './types/const/skill.type';
import { AuraSkillType } from './types/props/aura-skill.type';
import { SKILL_SCALING_BY_RACE_CONFIG } from './config/skillScaling/skill-scaling-by-race.const';
import { CharacterRace, CharacterSpeciality, CharacterStats } from '../character/types/baseCharacterProps/character-stats.type';
import { UNIQUE_ID_SKILLS } from './types/props/unique-id-skill.enum';
import { DamageSkillService } from './services/damage-skill.service';
import { AuraSkillService } from './services/aura-skill.service';
import { SkillFactory } from './factories/skill.factory';
import { SkillAuraEscalado } from './types/config/skill-aura-escalado.type';
import { SkillDamageEscalado } from './types/config/skill-damage-escalado.type';

@Injectable()
export class SkillService {

    constructor(
        private damageSkillService: DamageSkillService,
        private auraSkillService: AuraSkillService
    ) { }

    /**
     * Obtiene una skill completa actualizada
     *
     * - Se Crea la entidad de la skill
     * - Actualiza el nombre según el mastery tier
     * - Actualiza la posición del ícono segun el la masterizacion de la skill
     * - Calcula los efectos y daños de las skill de daño y auras
     *
     * @param {SkillType} skill - Skill base a actualizar
     * @param {CharacterRace} race - Raza del personaje
     * @param {CharacterSpeciality} speciality - Especialidad del personaje
     * @param {CharacterStats['general']} statsGeneral - Estadísticas generales
     * utilizadas para calcular los escalados
     *
     * @returns {SkillType} Skill completamente actualizada.
     */
    getUpdatedSkill(
        skill: SkillType,
        race: CharacterRace,
        speciality: CharacterSpeciality,
        statsGeneral: CharacterStats['general']
    ): SkillType {
        const skillEntity = SkillFactory.create(skill)

        skillEntity.updateSkillName(speciality)
        skillEntity.updatedIconPosition()

        const skillUpdated = skillEntity.toPrimitives()

        return this.calculateSkillEffect(skillUpdated, race, speciality, statsGeneral)
    } 


    /**
     * Calcula los efectos finales de una skill utilizando
     *
     * @param {SkillType} skill - Skill a calcular
     * @param {CharacterRace} race - Raza del personaje
     * @param {CharacterSpeciality} speciality - Especialidad del personaje
     * @param {CharacterStats['general']} statsGeneral - Stats generales del personaje
     *
     * @returns {SkillType} Skill con sus efectos calculados.
     *
     */
    private calculateSkillEffect(
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

    /**
     * Obtiene la configuración de escalado correspondiente
     * a una skill específica.
     *
     * La búsqueda se realiza por raza, especialidad, idSkill
     * 
     * @param {CharacterRace} race - Raza del personaje.
     * @param {CharacterSpeciality} speciality - Especialidad del personaje.
     * @param {UNIQUE_ID_SKILLS} idSkill - ID único de la skill.
     *
     * @returns {SkillDamageEscalado | SkillAuraEscalado}
     * Configuración de escalado encontrada.
     *
     */
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
