import { BonusCCRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"
import { CC_EFFECTS_CONFIG } from "../../config/effects.config"
import { CCffectKeys } from "../../types/config/effect-key.types"
import { CcEffectDescription, FighterType } from "../../types/entites/fight-entity.type"
import { ActionAttackerType } from "../../types/services/damage-description.type"
import { RngService } from "src/modules/shared/services/rng.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CcEffectService {

    constructor(
        private rngService: RngService
    ) { }

    /**
     * Calcula el estado final de un efecto de control sobre el defensor.
     *
     * @param effectKey Tipo de efecto de control a calcular.
     * @param attackerDmg Acción ejecutada por el atacante.
     * @param defender Peleador que puede recibir el efecto.
     * @param attacker Peleador que intenta aplicar el efecto.
     * @returns Estado actualizado del efecto.
     */
    getCcPlayerEffect(
        effectKey: BonusCCRefKeys,
        attackerDmg: ActionAttackerType,
        defender: FighterType,
        attacker: FighterType
    ): CcEffectDescription {
        const updatedEffect = { ...defender.effects[effectKey] }

        if (attackerDmg.type_action === 'healing') {
            return updatedEffect
        }

        if (!attackerDmg.effectsChances[effectKey]) {
            return updatedEffect
        }

        const effectResistance = this.getCcEffectBonus(effectKey, defender)

        //si pudo defenderse del cc no se aplica el efecto
        if (this.rngService.rollChance(effectResistance)) {
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

    /**
     * Obtiene la resistencia defensiva correspondiente
     * a un efecto de control.
     *
     * @param effectKey Efecto de control consultado.
     * @param defender Peleador defensor.
     * @returns Porcentaje de resistencia contra ese efecto.
     */
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