import { CHANGE_MASTERY_RANK_LV_VALUES } from "../const/change-rank-values.const";
import { ICON_POSITION_X, ICON_POSITION_Y } from "../const/icon-position.const";
import { BaseSkill, IconPisition } from "../types/base-skill.type";
import { MasteryLvRank } from "../types/skill-lv-rank.types";
import { AuraSkillEntity } from "./aura-skill.entity";
import { DamageSkillEntity } from "./damage-skill.entity";

export abstract class BaseSkillEntity<T extends BaseSkill = BaseSkill> {
    protected  props: T

    constructor(props: T) {
        this.props = props
     }

    get idSkill(): number {
        return this.props.idSkill
    }

    get lv(): number | MasteryLvRank {
        return this.props.lv
    }

    isDamageSkill(): this is DamageSkillEntity {
        return this.props.tipo === 'Daño'
    }

    isAuraSkill(): this is AuraSkillEntity {
        return this.props.tipo === 'Aura'
    }

    upgradeRankLv(): void {
        this.props.lv = this.getNextLv(this.props.lv)
        this.props.icon = this.getIconPosition()
    }

    /**
     * @description - Obtiene las coordenadas en el spritesheet para el icono de una skill
     * según su idPosition y nivel.
     * @note - para saber mas el porque de calcular las posiciones del icono de las skills
     * {@link ICON_POSITION_Y} {@link ICON_POSITION_X}
     */
    getIconPosition(): IconPisition {
        const ejeY = ICON_POSITION_Y[this.props.idPosition] ?? 0
        const groupOfPosition = this.props.idPosition <= 3 ? 3 : 6
        /*en el eje X, para saber su coordenada solo necesitamos si es un numero o la primera letra 
        si la habilidad esta masterizada */
        const categoryOfLvToUse = typeof this.props.lv === "number" ?
            'number'
            : this.props.lv.charAt(0)
        const ejeX = ICON_POSITION_X[groupOfPosition][categoryOfLvToUse] ?? 0
        return { x: ejeX, y: ejeY }
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
            letterLv: skillLv.charAt(0)
        }
    }
}