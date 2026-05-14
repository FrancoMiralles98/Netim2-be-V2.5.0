import { Injectable } from "@nestjs/common";
import { MasteryLvRank } from "../types/props/skill-lv-rank.types";
import { TOTAL_LV_POINTS_PER_MASTERY_CONFIG } from "../config/total-lv-points-per-mastery.config";
import { LetterMasteryLv } from "../types/config/letter-mastery-lv.type";
import { CharacterAttribute, CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { SkillScalingLv } from "../types/config/skill-base-escalado.type";

@Injectable()
export class SharedSkillService {
    /**
 * Obtiene los puntos efectivos
 * correspondientes al nivel de maestría de la habilidad.
 *
 * Si el nivel es numérico, se considera una habilidad básica.
 * Si es un rango de maestría (`M`, `G`, `P`), se calcula
 * utilizando la configuración de puntos por maestría.
 *
 * @param lv Nivel actual de la habilidad.
 * @returns Puntos efectivos y multiplicador aplicable.
 */
    getPointsLvBonification(lv: MasteryLvRank | number) {

        if (typeof lv === 'number') {
            return lv
        }

        const { letterLv, numberLv } = this.getLetterAndNumberOfMasteryLvRank(lv)

        if (TOTAL_LV_POINTS_PER_MASTERY_CONFIG[letterLv] === undefined) {
            throw new Error(`No se encuentra los lvPoints de la mastria ${letterLv}`)
        }

        //Se hace una separacion con 'P' porque en la config ya esta configurado con los puntos totales
        const points = letterLv === 'P'
            ? TOTAL_LV_POINTS_PER_MASTERY_CONFIG[letterLv]
            : TOTAL_LV_POINTS_PER_MASTERY_CONFIG[letterLv] + numberLv

        return points
    }

    /**
     * Obtiene el multiplicador correspondiente
     * al rango de maestría de la habilidad.
     *
     * @param rank Rango de maestría (`M`, `G` o `P`).
     * @param scaling Configuración de escalado.
     * @returns Multiplicador asociado al rango.
     */
    getMultiMasteryLvBonification(lv: MasteryLvRank | number, escaladoLv: SkillScalingLv): number {

        if (typeof lv === 'number') {
            return escaladoLv.basicMulti
        }

        const { letterLv } = this.getLetterAndNumberOfMasteryLvRank(lv)

        if (letterLv === 'M') {
            return escaladoLv.masterMulti
        }
        if (letterLv === 'G') {
            return escaladoLv.granMasterMulti
        }
        if (letterLv === 'P') {
            return escaladoLv.perfectMulti
        }

        throw new Error('Error al encontrar el rank del escaladoLv')
    }

    /**
 * Separa el rango de maestría y el número
 * del nivel de habilidad.
 *
 * @param skillLv Nivel de maestría de la habilidad.
 * @returns Letra de rango y número de nivel.
 */
    getLetterAndNumberOfMasteryLvRank(skillLv: MasteryLvRank) {
        return {
            numberLv: skillLv === 'P' ? 0 : Number(skillLv.slice(1)),
            letterLv: skillLv.charAt(0) as LetterMasteryLv
        }
    }


    /**
     * Calcula el multiplicador total generado por los atributos
     * escalables de la habilidad.
     *
     * Cada atributo agrega una bonificación porcentual basada en:
     * la suma de los LvPoints y bonusPoints de del atributo en que escala la hab
     *
     * El escalado el es siguiente:
     * @example
     * si escaladoAtributos es : {VIT: 20}
     *  - Se tomara ese valor (20) como porcentaje de dicho atributo que tiene en total el personje
     *  - se sumara al acc (por si tiene mas de un escalado de atributo)
     *  - luego este valor se usara como multiplicador de daño o effecto adicion final
     *  dependiendo si es un aura o una habilidad de daño 
     * Ejemplo:
     *  - Si se tiene 100 puntos de VIT totales y la skill escala con 20% de VIT obtendra:
     *   1.20 = +20% de daño / aumento de effecto de aura
     *
     * @param statsGeneral Estadísticas generales del personaje.
     * @param scaling Configuración de escalado de atributos.
     * @returns Multiplicador final de atributos.
     */
     getAttributeBonification(
        statsGeneral: CharacterStats['general'],
        attributeScaling: Partial<Record<CharacterAttribute, number>>
    ): number {
        let bonification = 0
        for (const [attribute, value] of Object.entries(attributeScaling) as [CharacterAttribute, number][]) {

            const attributeCharacter = statsGeneral[attribute]
            const totalAttributeValue = attributeCharacter.bonusPoints + attributeCharacter.lvPoints

            bonification += totalAttributeValue * (value / 100)
        }

        return 1 + bonification / 100
    }
}