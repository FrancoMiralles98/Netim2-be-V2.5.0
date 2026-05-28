import { Injectable } from "@nestjs/common";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { BONUS_EFFECTS_CONFIG, DAMAGE_EFFECTS_CONFIG } from "../../config/effects.config";

/**
 * Servicio encargado de calcular los cambios de HP
 * generados durante un turno de combate.
 *
 * Responsabilidades:
 * - Calcular curación recibida por el atacante.
 * - Calcular reducción de curación por corta curación.
 * - Calcular daño recibido por el defensor.
 * - Aplicar daño de efectos activos.
 * - Aplicar daño reflejado sobre el atacante.
 */
@Injectable()
export class HpService {

    /**
     * Calcula la curación final del atacante y cuánto fue reducido
     * por efectos defensivos como corta curación.
     *
     * @param attacker Peleador que recibe la curación.
     * @param attackerAction Acción realizada por el atacante.
     * @param defenderAction Respuesta defensiva del defensor.
     * @returns Curación final y cantidad de curación cortada.
     */
    getHealingResult(
        attacker: FighterType,
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
    ): { attackerHealing: number, defenderCortaCura: number } {
        let attackerHealing = this.calculateAttackerHealing(attacker, attackerAction, defenderAction)

        const defenderCortaCura = this.calculateCortaCura(attackerHealing, attacker, defenderAction)

        attackerHealing = Math.max(0, attackerHealing - defenderCortaCura)

        return { attackerHealing, defenderCortaCura }
    }

    /**
     * Calcula la vida final que recupera el atacante,
     * descontando el daño reflejado recibido.
     *
     * @param healing Curación calculada.
     * @param defenderAction Respuesta defensiva del defensor.
     * @returns HP neto recuperado por el atacante.
     */
    calculateAttackerHealedReceived(
        healing: number,
        defenderAction: ActionDefenderType
    ): number {
        return healing - defenderAction.reflectar_dmg
    }

    /**
     * Calcula el daño total recibido por el defensor.
     *
     * Incluye:
     * - daño directo recibido
     * - daño por efectos activos
     *
     * Los efectos no se aplican durante doble golpe.
     *
     * @param dmg Daño directo recibido.
     * @param defenderEffects Efectos activos del defensor.
     * @param isDobleGolpe Indica si la acción es un golpe extra.
     * @returns Daño total recibido.
     */
    calculateDefenderDamageReceived(
        dmg: number,
        defenderEffects: FighterEffectDescription,
        isDobleGolpe: boolean
    ): number {
        let totalDmg = 0
        
        if (!isDobleGolpe) {
            for (const key of Object.keys(defenderEffects) as Array<keyof typeof defenderEffects>) {
                const effect = defenderEffects[key]
                if (typeof effect !== 'object' || effect.type !== 'damage') {
                    continue;
                }
                totalDmg += effect.isActive ? effect.dmgOfEffect : 0
            }

        }

        return totalDmg + dmg

    }


     /**
     * Calcula la curación base generada por el atacante.
     *
     * La curación puede provenir de:
     * - habilidad de curación
     * - robo de vida por ataque básico
     * - vampirismo de hechizo por skill
     * - regeneración natural de HP
     *
     * @param attacker Peleador atacante.
     * @param attackerAction Acción realizada.
     * @param defenderAction Respuesta defensiva.
     * @returns Curación base truncada.
     */
    private calculateAttackerHealing(
        attacker: FighterType,
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
    ): number {
        let healing = 0

        //Se calcula el total de curacion que obtiene de habilidad o ataque basico
        switch (attackerAction.type_action) {
            case 'healing':
                healing = attackerAction.healing
                break;
            case 'basic_attack':
                healing = defenderAction.dmgToReceive * attacker.stats.bonus.defensa.robo_vida / 100
                break;
            case 'skill': {
                const bonus = attackerAction.effectsChances.vampirismo_hechizo + attacker.stats.bonus.defensa.vampirismo_hechizo
                healing = defenderAction.dmgToReceive * bonus / 100
                break;
            }
            default:
                throw new Error(`Tipo de accion invalido`);
        }

        //Se le suma tambien la regeneracion de Hp del atacante
        healing += attacker.stats.general.hp.max * attacker.stats.general.regen_hp / 100

        return Math.max(0, Math.trunc(healing))
    }


    /**
     * Calcula cuánta curación es reducida por corta curación.
     *
     * También aumenta la reducción si el atacante está afectado
     * por veneno.
     *
     * @param attackerHealing Curación base del atacante.
     * @param attacker Peleador que intenta curarse.
     * @param defenderAction Respuesta defensiva del defensor.
     * @returns Cantidad de curación reducida.
     */
    private calculateCortaCura(
        attackerHealing: number,
        attacker: FighterType,
        defenderAction: ActionDefenderType,
    ): number {
        if (!defenderAction.defensiveChance.corta_curacion) {
            return 0
        }

        let cortaCuraBonusValue = BONUS_EFFECTS_CONFIG.corta_curacion.porcent

        cortaCuraBonusValue += attacker.effects.veneno.isActive
            ? DAMAGE_EFFECTS_CONFIG.veneno.corta_cura_porcent
            : 0


        const totalCortaCura = Math.min(cortaCuraBonusValue, 100)

        return Math.trunc(attackerHealing * totalCortaCura / 100)
    }
}