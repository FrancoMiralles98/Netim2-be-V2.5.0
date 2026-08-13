import { Injectable } from '@nestjs/common';
import { DamageSkillService } from './services/damage/damage-skill.service';
import { AuraSkillService } from './services/aura/aura-skill.service';
import { SkillFactory } from './factories/skill.factory';
import { ALL_SKILLS } from './const/skills';
import { Atributos, CharacterRace, CharacterSpeciality, SkillType, Stats } from 'netim2-shared';
import { BuffSkillService } from './services/buffo/buff-skill.service';
import { SkillMapper } from './mapper/skill-mapper';

@Injectable()
export class SkillService {

    constructor(
        private damageSkillService: DamageSkillService,
        private auraSkillService: AuraSkillService,
        private buffSkillService: BuffSkillService,
    ) { }

    /**
    * Obtiene el listado de skills disponibles
    * para una especialidad específica.
    *
    * @param {CharacterSpeciality} speciality - Especialidad del personaje.
    *
    * @returns {SkillType[]} Array de skills pertenecientes
    * a la especialidad indicada.
    */
    getSpecialitySkillPool(speciality: CharacterSpeciality): SkillType[] {
        const summarySkills = ALL_SKILLS[speciality]
        const skills = summarySkills.map(summary => {
            const skillEntity = SkillFactory.create(SkillMapper.summaryToSkill(summary))
            return skillEntity.toPrimitives()
        })
        return skills
    }

    /**
     * Obtiene una skill completa actualizada con opcion de aumentar de nivel
     *
     * - Se Crea la entidad de la skill
     * - Actualiza el nombre según el mastery tier
     * - Actualiza la posición del ícono segun el la masterizacion de la skill
     * - Calcula los efectos y daños de las skill de daño y auras
     *
     * - Y se tiene la opcion de aumentar el nivel de la habilidad
     * 
     * @param {SkillType} skill - Skill base a actualizar
     * @param {CharacterRace} race - Raza del personaje
     * @param {CharacterSpeciality} speciality - Especialidad del personaje
     * @param {CharacterStats['general']} statsGeneral - Estadísticas generales
     * utilizadas para calcular los escalados
     * @param {boolean} lvUp - Opcion de aumentar de nivel la habilidad
     *
     * @returns {SkillType} Skill completamente actualizada.
     */
    getUpdatedSkill(
        skill: SkillType,
        race: CharacterRace,
        speciality: CharacterSpeciality,
        stats: Stats,
        atributos:Atributos,
        lvUp: boolean = false
    ): SkillType {
        const skillEntity = SkillFactory.create(skill)

        if (lvUp) {
            skillEntity.upgradeRankLv()
        }

        skillEntity.updateSkillName(speciality)

        const skillUpdated = skillEntity.toPrimitives()

        return this.handleUpdateSkill(skillUpdated, race, speciality, stats,atributos)
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
    private handleUpdateSkill(
        skill: SkillType,
        race: CharacterRace,
        speciality: CharacterSpeciality,
        stats: Stats,
        atributos:Atributos
    ): SkillType {
        switch (skill.type) {
            case 'damage':
                return this.damageSkillService.getUpdatedSkill(skill, stats, race, speciality,atributos)
            case 'aura':
                return this.auraSkillService.getUpdatedAura(skill, stats, race, speciality,atributos)
            case 'buff':
                return this.buffSkillService.getUpdatedSkill(skill, race, speciality)
            default:
                throw new Error(`No se encuentra un tipo de la habilidad para actualizar`);
        }
    }
}
