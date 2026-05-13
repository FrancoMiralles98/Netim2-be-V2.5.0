import { CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { CHANGE_MASTERY_RANK_LV_VALUES } from "../config/change-rank-values.const";
import { ICON_POSITION_X, ICON_POSITION_Y } from "../config/icon-position.const";
import { BaseSkill, IconPisition } from "../types/props/base-skill.type";
import { MasteryLvRank } from "../types/props/skill-lv-rank.types";
import { ALL_SKILLS_NAMES } from "../const/skillsNames";
import { NamesByTierMasteryLv } from "../types/const/skills-names.type";
import { LetterMasteryLv } from "../types/config/letter-mastery-lv.type";

export abstract class BaseSkillEntity<T extends BaseSkill = BaseSkill> {
    protected props: T

    constructor(props: T) {
        this.props = props
    }

    get idSkill(): number {
        return this.props.idSkill
    }

    get lv(): number | MasteryLvRank {
        return this.props.lv
    }

    upgradeRankLv(): void {
        this.props.lv = this.getNextLv(this.props.lv)
    }

    /**
     * @description - Obtiene las coordenadas en el spritesheet para el icono de una skill
     * según su idPosition y nivel.
     * @note - para saber mas el porque de calcular las posiciones del icono de las skills
     * {@link ICON_POSITION_Y} {@link ICON_POSITION_X}
     */
    updatedIconPosition(): void {
        const ejeY = ICON_POSITION_Y[this.props.idPosition] ?? 0
        const groupOfPosition = this.props.idPosition <= 3 ? 3 : 6

        /*en el eje X, para saber su coordenada solo necesitamos si es un numero o la primera letra 
        si la habilidad esta masterizada */
        const categoryOfLvToUse = typeof this.props.lv === "number" ?
            'number'
            : this.props.lv.charAt(0)
        const ejeX = ICON_POSITION_X[groupOfPosition][categoryOfLvToUse] ?? 0

        this.props.icon =  { x: ejeX, y: ejeY }
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
            newLv = skillLv < 16 ? skillLv + 1 : 'M1'
        } else {
            const { letterLv, numberLv } = this.getLetterAndNumberOfMasteryLvRank(skillLv)
            newLv = numberLv < 10 ?
                `${letterLv}${numberLv + 1}` as MasteryLvRank
                : CHANGE_MASTERY_RANK_LV_VALUES[skillLv]
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

        const skillNames = specialitySkillsNames[this.props.idSkill]

        if (!skillNames) {
            throw new Error(`No se encuentra el la lista de nombres de la skill idSkill: ${this.props.idSkill}`)
        }

        this.props.nombre = this.getSkillNameByMasteryTier(skillNames)
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
    private getSkillNameByMasteryTier(namesByTier: NamesByTierMasteryLv) {
        let tierOfSkill: LetterMasteryLv | 'N' = typeof this.props === 'number'
            ? 'N'
            : this.getLetterAndNumberOfMasteryLvRank(this.props.lv as MasteryLvRank).letterLv

        return namesByTier[tierOfSkill]
    }
}