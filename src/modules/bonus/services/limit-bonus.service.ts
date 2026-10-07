import { Injectable } from "@nestjs/common";
import { LIMIT_BONUS_CONFIG } from "../config/limit-bonus.config";
import { BonusRefKeys, Stats } from "netim2-shared";

/**
 * Servicio encargado de aplicar límites máximos a los bonus
 * y estadísticas del personaje.
 *
 * Se utiliza para evitar que ciertos bonus superen los valores
 * permitidos definidos en `LIMIT_BONUS_CONFIG`.
 */
@Injectable()
export class LimitBonusService {
    applyBonusLimitsToStats (stats:Stats): Stats {
        return {
            general: this.limitToGeneralStats(stats.general),
            bonus: this.limitToBonusStats(stats.bonus),
        }
    }

    private limitToGeneralStats (bonus: Stats["general"]): Stats["general"] {
        return {
            ...bonus,
            vh: this.limitBonusValue('vh',bonus.vh),

        }
    }

    private limitToBonusStats(bonus:Stats["bonus"]): Stats["bonus"] {
        return {
            miscs: this.limitBonusToGroup(bonus.miscs),
            defensa: this.limitBonusToGroup(bonus.defensa),
            daño: this.limitBonusToGroup(bonus.daño),
            cc: this.limitBonusToGroup(bonus.cc)
        }
    }

    /**
     * Aplica límites a un grupo de bonus.
     *
     * Recorre todas las propiedades del grupo y verifica si
     * existe un límite configurado en LIMIT_BONUS_CONFIG.
     *
     * Si el valor supera el límite, se reemplaza por el máximo permitido.
     *
     * @param {T} group - Grupo de bonus a limitar.
     * @returns {T} Grupo de bonus con límites aplicados.
     */
    private limitBonusToGroup <T extends Partial<Record<BonusRefKeys,number>>>(group: T): T {
        const limitedGroup = {...group}
        for (const key of Object.keys(group) as Array<keyof T>) {
            const bonusRefKey = key as BonusRefKeys
            const value = group[bonusRefKey] 

            if (typeof value !== 'number' || LIMIT_BONUS_CONFIG[bonusRefKey] === undefined) {
                continue
            }

            limitedGroup[bonusRefKey] = Math.min(value, LIMIT_BONUS_CONFIG[bonusRefKey])
        }

        return limitedGroup
    }

    /**
     * Limita un valor individual de bonus.
     *
     * Si el bonus tiene un límite configurado y el valor lo supera,
     * retorna el límite máximo permitido.
     *
     * @param {BonusRefKeys} bonusRef - Referencia del bonus.
     * @param {number} value - Valor actual del bonus.
     * @returns {number} Valor limitado.
     */
    private limitBonusValue (bonusRef: BonusRefKeys, value:number): number {
        const limitBonus = LIMIT_BONUS_CONFIG[bonusRef]

        if (limitBonus === undefined) {
            return value
        }

        return Math.min(limitBonus,value)

    }
}