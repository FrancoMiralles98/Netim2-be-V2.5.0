import { BonusCCRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"
import { CC_EFFECTS_CONFIG } from "../../config/effects.config"
import { CCffectKeys } from "../../types/config/effect-key.types"
import { CcEffectDescription, FighterType } from "../../types/entites/fight-entity.type"
import { ActionAttackerType } from "../../types/services/damage-description.type"
import { RngService } from "src/modules/shared/services/rng.service"

export class CcEffectService {

    constructor(
        private rngService: RngService
    ){

    }

    getCcPlayerEffect(
        effectKey: BonusCCRefKeys,
        attackerDmg: ActionAttackerType,
        defender: FighterType,
        attacker: FighterType
    ): CcEffectDescription {
        const updatedEffect = { ...defender.effects[effectKey] }

        const effectResistance = this.getCcEffectBonus(effectKey, defender)

        if (this.rngService.rollChance(effectResistance)) {
            return updatedEffect
        }

        if (attackerDmg.type_action === 'healing') {
            return updatedEffect
        }

        if (!attackerDmg.effectsChances[effectKey]) {
            return updatedEffect
        }

        const totalTurns =
            Math.round(CC_EFFECTS_CONFIG[effectKey].turns * (1 + attacker.stats.bonus.daño.duracion_estado / 100))

        return {
            isActive: true,
            turnsRemaining: totalTurns,
            type: 'cc'
        }
    }



    private getCcEffectBonus(
        effectKey: CCffectKeys,
        defender: FighterType
    ): number {
        const bonusByEffect: Record<CCffectKeys, number> = {
            retardo: defender.stats.bonus.defensa.def_retardo,
            desmayo: defender.stats.bonus.defensa.def_desmayo,
        }

        return bonusByEffect[effectKey]
    }
}