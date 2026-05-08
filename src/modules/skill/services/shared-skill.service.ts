import { Injectable } from "@nestjs/common";
import { MasteryLvRank } from "../types/skill-lv-rank.types";
import { SkillDamageEscalado } from "../types/skill-scaling.type";
import { TOTAL_LV_POINTS_PER_MASTERY_CONFIG } from "../config/total-lv-points-per-mastery.config";
import { LetterMasteryLv } from "../types/letter-mastery-lv.type";

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
    getMultiMasteryLvBonification(lv: MasteryLvRank | number, scaling: SkillDamageEscalado): number {
        
        if (typeof lv === 'number') {
            return scaling.escaladoLv.basicMulti
        }
        
        const { letterLv } = this.getLetterAndNumberOfMasteryLvRank(lv)

        if (letterLv === 'M') {
            return scaling.escaladoLv.masterMulti
        }
        if (letterLv === 'G') {
            return scaling.escaladoLv.granMasterMulti
        }
        if (letterLv === 'P') {
            return scaling.escaladoLv.perfectMulti
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
}