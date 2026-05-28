import { Injectable } from "@nestjs/common";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { DamageEffectService } from "./damage-effect.service";
import { CcEffectService } from "./cc-effect.service";

@Injectable()
export class EffectsService {

    constructor(
        private damageEffectService: DamageEffectService,
        private ccEffectService: CcEffectService,
    ) {}

    /**
     * Calcula los efectos finales del defensor luego de recibir
     * una acción del atacante.
     *
     * @param attackerAction Acción ejecutada por el atacante.
     * @param attacker Peleador que aplica los efectos.
     * @param defender Peleador que puede recibir los efectos.
     * @returns Efectos actualizados del defensor.
     */
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

   
    /**
     * Reduce en 1 turno la duración restante de todos los efectos activos.
     *
     * Si un efecto llega a 0 turnos restantes, se desactiva.
     *
     * @param effects Efectos actuales del peleador.
     * @returns Efectos actualizados.
     */
    reduceDurationOfEffects(effects: FighterEffectDescription): FighterEffectDescription {
        const updatedEffect = structuredClone(effects)
        for (const keyEffect of Object.keys(effects) as Array<keyof FighterEffectDescription>) {
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