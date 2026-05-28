import { Injectable } from "@nestjs/common";
import { BONUS_EFFECTS_CONFIG, CC_EFFECTS_CONFIG } from "../../config/effects.config";
import { FighterEffectDescription } from "../../types/entites/fight-entity.type";

@Injectable()
export class BonusEffectService {
    /**
    * Aplica la reducción del efecto `retardo` sobre una propiedad
    * de velocidad del peleador.
    *
    * Puede afectar:
    * - `vm`: velocidad de movimiento
    * - `va`: velocidad de ataque
    * - `vh`: velocidad de habilidad
    *
    * @param fighterEffect Efectos actuales del peleador.
    * @param propToApllyEffect Propiedad afectada por retardo.
    * @param propValueToReduce Valor original de la propiedad.
    * @returns Valor final luego de aplicar retardo.
    */
    calculateRetardoEffect(
        fighterEffect: FighterEffectDescription,
        propToApllyEffect: 'vm' | 'va' | 'vh',
        propValueToReduce: number
    ): number {
        const reductionValue = CC_EFFECTS_CONFIG.retardo[propToApllyEffect]
        if (reductionValue === undefined) {
            throw new Error('No se encuentra la prop a reducir del retardo')
        }

        return fighterEffect.retardo.isActive
            ? propValueToReduce - reductionValue
            : propValueToReduce
    }

    /**
     * Aplica el efecto de penetración sobre una defensa.
     *
     * Puede reducir:
     * - defensa porcentual (los bonus defensivos)
     * - defensa plana (la armadura del personaje)
     *
     * @param isPenetracion Indica si la penetración fue activada.
     * @param propToApllyEffect Tipo de defensa afectada.
     * @param propValueToReduce Valor defensivo original.
     * @returns Valor defensivo luego de aplicar penetración.
     */
    calculatePenetracionEffect(
        isPenetracion: boolean,
        propToApllyEffect: 'bonus_def' | 'flat_def',
        propValueToReduce: number
    ): number {

        if (!isPenetracion) {
            return propValueToReduce
        }

        const penetratcionConfig = propToApllyEffect === 'bonus_def'
            ? BONUS_EFFECTS_CONFIG.penetracion.reduction_bonus_def
            : BONUS_EFFECTS_CONFIG.penetracion.reduction_flat_def

        return propValueToReduce * (1 - (penetratcionConfig / 100))
    }
}