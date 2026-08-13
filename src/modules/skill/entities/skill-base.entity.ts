import { CHANGE_MASTERY_RANK_LV_VALUES } from "../config/change-rank-values.const";
import { ALL_SKILLS_NAMES } from "../const/skillsNames";
import { CharacterSpeciality, LetterMasteryLv, MasteryLvRank, SkillBase } from "netim2-shared";
import { SkillNamesByGrade } from "../types/skills-names.type";

export abstract class BaseSkillEntity<T extends SkillBase = SkillBase> {
    protected props: T

    constructor(props: T) {
        this.props = props
    }

    get idSkill(): number {
        return this.props.id
    }

    get lv(): number | MasteryLvRank {
        return this.props.lv
    }

    upgradeRankLv(): void {
        this.props.lv = this.getNextLv(this.props.lv)
    }

/**
* Actualiza el nombre de la skill segun el nivel de maestría actual de la skill
*
* Busca la lista de nombres disponibles para la especialidad indicada
* y selecciona el nombre correspondiente al tier de maestría actual
*
* @param {CharacterSpeciality} speciality - Especialidad del personaje
* utilizada para obtener la configuración de nombres de habilidades
*/
    updateSkillName(speciality: CharacterSpeciality) {
        const specialitySkillsNames = ALL_SKILLS_NAMES[speciality]

        const skillNames = specialitySkillsNames[this.props.id]

        if (!skillNames) {
            throw new Error(`No se encuentra el la lista de nombres de la skill id: ${this.props.id}`)
        }

        this.props.nombre = this.getSkillNameByMasteryTier(skillNames)
    }


    /**
     * Incrementa el nivel o rango de una skill según las reglas de progresión:
     * - Niveles numéricos (1-16) se incrementan normalmente
     * - Al llegar a 16 se convierte en M1
     * - Rangos M y G avanzan hasta 10 y luego cambian al siguiente rango
     * - El rango P es el máximo y no cambia
     *
     * @param {number | MasteryLvRank} skillLv - Nivel actual de la habilidad
     * @example
     * // De nivel numérico a M1
     * upgradeSkillLv(16); // Retorna 'M1'
     *
     * @example
     * // Avance dentro de un rango
     * upgradeSkillLv('M5'); // Retorna 'M6'
     */
    private getNextLv(skillLv: number | MasteryLvRank) {
        if (skillLv === 'P') {
            return skillLv
        }

        let newLv: number | MasteryLvRank = 0

        if (typeof skillLv === 'number') {
            return newLv = skillLv < 16 ? skillLv + 1 : 'M1'
        }

        const { letterLv, numberLv } = this.getLetterAndNumberOfMasteryLvRank(skillLv)

        if (numberLv < 10) {
            newLv  = `${letterLv}${numberLv + 1}` as MasteryLvRank
        } else {

            const changeMasteryRank = CHANGE_MASTERY_RANK_LV_VALUES[skillLv]

            if (!changeMasteryRank) {
                throw new Error ('No se encuentra el Cambio de rango de la skill')
            }

            newLv = changeMasteryRank
        }

        return newLv
    }

    /**
     * @description Extrae la letra y número de un nivel en formato de rango 
     * @param {MasteryLvRank} skillLv - Nivel en formato de rango (ej. 'M1', 'G10')
     * @example
     * getLetterAndNumberOfLvSkill('G5'); 
     * @returns letterLv: 'G', numberLv: 5
     */
    private getLetterAndNumberOfMasteryLvRank(skillLv: MasteryLvRank) {
        return {
            numberLv: Number(skillLv.slice(1)),
            letterLv: skillLv.charAt(0) as LetterMasteryLv
        }
    }


    /**
    * Obtiene el nombre correspondiente al tier de maestría actual de la skill.
    *
    * - Si la skill aún no está masterizada (lv numérico de 1 a 16),
    *   se utiliza el tier N.
    * - Si la skill posee un rango de maestría (`MasteryLvRank`),
    *   se obtiene automáticamente la letra correspondiente (M, G, P).
    * 
    * @param {NamesByTierMasteryLv} namesByTier - Objeto que contiene
    * los nombres de la skill organizados por tier de maestría.
    *
    * @returns {string} Nombre correspondiente al tier actual de la skill.
    */
    private getSkillNameByMasteryTier(namesByTier: SkillNamesByGrade) {

        const tierOfSkill: LetterMasteryLv | 'N' = typeof this.props === 'number'
            ? 'N'
            : this.getLetterAndNumberOfMasteryLvRank(this.props.lv as MasteryLvRank).letterLv

        return namesByTier[tierOfSkill]
    }
}