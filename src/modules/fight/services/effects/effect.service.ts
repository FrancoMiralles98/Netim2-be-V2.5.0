import { Injectable } from "@nestjs/common";
import { CcEffectDescription, DmgEffectDescription, FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { BONUS_EEFECTS_CONFIG, CC_EFFECTS_CONFIG, DAMAGE_EFFECTS_CONFIG } from "../../config/effects.config";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { CCffectKeys, DamageEffectKeys } from "../../types/config/effect-key.types";
import { BonusCCRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { DamageEffectService } from "./damage-effect.service";
import { CcEffectService } from "./cc-effect.service";

@Injectable()
export class EffectsService {

    constructor(
        private damageEffectService: DamageEffectService,
        private ccEffectService: CcEffectService,
    ) {

    }

    calculateEffectPlayer(
        attackerAction: ActionAttackerType,
        attacker: FighterType,
        defender: FighterType
    ): FighterEffectDescription {
        const updatedEffectPlayer = structuredClone(defender.effects)

        updatedEffectPlayer.desmayo = this.ccEffectService.getCcPlayerEffect(
            'desmayo', attackerAction, defender, attacker)
        updatedEffectPlayer.retardo = this.ccEffectService.getCcPlayerEffect(
            'retardo', attackerAction, defender, attacker)
        updatedEffectPlayer.incendio = this.damageEffectService.getDamagePlayerEffect(
            'incendio', attackerAction, attacker, defender)
        updatedEffectPlayer.sangrado = this.damageEffectService.getDamagePlayerEffect(
            'sangrado', attackerAction, attacker, defender)
        updatedEffectPlayer.veneno = this.damageEffectService.getDamagePlayerEffect(
            'veneno', attackerAction, attacker, defender)

        return updatedEffectPlayer
    }

    calculateRetardoEffect(
        fighterEffect: FighterEffectDescription,
        propToApllyEffect: 'vm' | 'va' | 'vh',
        propValueToReduce: number
    ): number {
        const reductionValue = CC_EFFECTS_CONFIG.retardo[propToApllyEffect]
        if (!reductionValue) {
            throw new Error('No se encuentra la prop a reducir del retardo')
        }

        return fighterEffect.retardo.isActive
            ? propValueToReduce - reductionValue
            : propValueToReduce
    }

    calculatePenetracionEffect(
        isPenetracion: boolean,
        propToApllyEffect: 'bonus_def' | 'flat_def',
        propValueToReduce: number
    ): number {

        if (!isPenetracion) {
            return propValueToReduce
        }

        const penetratcionConfig = propToApllyEffect === 'bonus_def'
            ? BONUS_EEFECTS_CONFIG.penetracion.reduction_bonus_def
            : BONUS_EEFECTS_CONFIG.penetracion.reduction_flat_def

        return propValueToReduce * (1 - (penetratcionConfig / 100))
    }


    calcuateCdOfEffects(effects: FighterEffectDescription): FighterEffectDescription {
        const updatedEffect = { ...effects }
        for (const keyEffect of Object.values(effects) as Array<keyof FighterEffectDescription>) {
            const effect = updatedEffect[keyEffect]

            if (typeof effect !== 'object') {
                continue;
            }

            if (effect.turnsRemaining > 0) {
                effect.turnsRemaining -= 1
            }

            if (effect.turnsRemaining <= 0) {
                effect.isActive = false
            }
        }
        return updatedEffect
    }
}