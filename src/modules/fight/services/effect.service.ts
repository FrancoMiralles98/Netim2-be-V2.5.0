import { Injectable } from "@nestjs/common";
import { FighterEffectDescription } from "../types/entites/fight-entity.type";
import { EFFECTS_CONFIG } from "../config/effects.config";

@Injectable()
export class EffectsService {

    calculateRetardoEffect (
        fighterEffect: FighterEffectDescription,
        propToApllyEffect: 'vm' | 'va' | 'vh',
        propValueToReduce: number
    ): number {
        const reductionValue = EFFECTS_CONFIG.retardo[propToApllyEffect]
        if (!reductionValue) {
            throw new Error ('No se encuentra la prop a reducir del retardo')
        }

        return fighterEffect.retardo.isActive 
        ? propValueToReduce - reductionValue
        : propValueToReduce
    }

    calculatePenetracionEffect(
        isPenetracion: boolean,
        propToApllyEffect: 'bonus_def'|'flat_def',
        propValueToReduce: number
    ): number {

        if (!isPenetracion) {
            return propValueToReduce
        }
        
        return propToApllyEffect === 'bonus_def'
        ? propValueToReduce - EFFECTS_CONFIG.penetracion.reduction_bonus_def
        : propValueToReduce * (1 - (EFFECTS_CONFIG.penetracion.reduction_flat_def / 100))
    }
}