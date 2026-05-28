import { Injectable } from "@nestjs/common"
import { DAMAGE_EFFECTS_CONFIG } from "../../config/effects.config"
import { DamageEffectKeys } from "../../types/config/effect-key.types"
import { DmgEffectDescription, FighterType } from "../../types/entites/fight-entity.type"
import { ActionAttackerType } from "../../types/services/damage-description.type"
import { BonusEffectService } from "./bonus-effect.service"

@Injectable()
export class DamageEffectService {

    constructor(
        private bonusEffectService: BonusEffectService
    ) { }

    /**
     * Calcula el estado final de un efecto de daño sobre el defensor.
     *
     * Flujo:
     * - Ignora efectos si la acción recibida es curación.
     * - Verifica si el efecto fue activado por el atacante.
     * - Calcula el daño base del efecto.
     * - Aplica bonus ofensivos del atacante.
     * - Aplica defensas del defensor.
     * - Mantiene el daño más fuerte si el efecto ya estaba activo.
     *
     * @param effectKey Tipo de efecto de daño a calcular.
     * @param attackerDmg Acción ejecutada por el atacante.
     * @param attacker Peleador que aplica el efecto.
     * @param defender Peleador que puede recibir el efecto.
     * @returns Estado actualizado del efecto.
     */
    getDamagePlayerEffect(
        effectKey: DamageEffectKeys,
        attackerDmg: ActionAttackerType,
        attacker: FighterType,
        defender: FighterType,
    ): DmgEffectDescription {
        const updatedEffect = { ...defender.effects[effectKey] }

        if (attackerDmg.type_action === 'healing') {
            return updatedEffect
        }

        if (!attackerDmg.effectsChances[effectKey]) {
            return updatedEffect
        }

        const effectConfig = DAMAGE_EFFECTS_CONFIG[effectKey]

        const totalBonus = this.getDamageEffectBonus(effectKey, attacker)

        const extraPorcentBonus = this.getExtraPorcentBonusDamage(effectKey, defender)

        const totalPorcentBaseDmg = effectConfig.porcent_base_damage + extraPorcentBonus

        let effectDmg = attackerDmg.dmg * totalPorcentBaseDmg / 100

        effectDmg *= 1 + totalBonus / 100

        //Al final se le aplica las reduccion de daño del defensor
        const defenseBonus = Math.min(this.getDefenseEffectBonus(effectKey, defender), 100)
        effectDmg *= 1 - defenseBonus / 100

        const totalTurns =
            Math.round(effectConfig.turns * (1 + attacker.stats.bonus.daño.duracion_estado / 100))

        const strongerDamage = Math.max(
            effectDmg,
            updatedEffect.dmgOfEffect,
        )

        /*Si ya estaba activo se deja el daño mas alto y si no lo tenia activo se deja el daño que lo 
        ocasiono*/
        const finalDmg = updatedEffect.isActive
            ? strongerDamage
            : effectDmg

        return {
            dmgOfEffect: Math.trunc(finalDmg),
            isActive: true,
            turnsRemaining: totalTurns,
            type: 'damage',
        }
    }

    /**
     * Obtiene el bonus ofensivo del atacante para un efecto de daño.
     *
     * Incluye:
     * - bonus específico del efecto
     * - bonus general de estados
     *
     * @param effectKey Tipo de efecto de daño.
     * @param attacker Peleador atacante.
     * @returns Porcentaje total de bonus ofensivo.
     */
    private getDamageEffectBonus(
        effectKey: DamageEffectKeys,
        attacker: FighterType,
    ): number {
        const bonusByEffect: Record<DamageEffectKeys, number> = {
            veneno: attacker.stats.bonus.daño.bonus_veneno,
            incendio: attacker.stats.bonus.daño.bonus_fuego,
            sangrado: attacker.stats.bonus.daño.bonus_sangrado,
        }
        return bonusByEffect[effectKey] + attacker.stats.bonus.daño.bonus_estado
    }

    /**
     * Obtiene la defensa del defensor contra un efecto de daño.
     *
     * @param effectKey Tipo de efecto de daño.
     * @param defender Peleador defensor.
     * @returns Porcentaje de defensa contra ese efecto.
     */
    private getDefenseEffectBonus(
        effectKey: DamageEffectKeys,
        defender: FighterType
    ): number {
        const defenseByEffect: Record<DamageEffectKeys, number> = {
            veneno: defender.stats.bonus.defensa.def_veneno,
            incendio: defender.stats.bonus.defensa.def_incendio,
            sangrado: defender.stats.bonus.defensa.def_sangrado,
        }

        return defenseByEffect[effectKey]
    }

    /**
    * Obtiene daño porcentual extra para efectos especiales.
    *
    * Reglas:
    * - Incendio gana daño extra si el objetivo ya está incendiado.
    * - Sangrado escala con la VM del defensor.
    *
    * @param effectKey Tipo de efecto de daño.
    * @param defender Peleador defensor.
    * @returns Porcentaje extra de daño base.
    */
    private getExtraPorcentBonusDamage(
        effectKey: DamageEffectKeys,
        defender: FighterType
    ): number {

        if (effectKey === 'incendio' && defender.effects.incendio.isActive) {
            return DAMAGE_EFFECTS_CONFIG[effectKey].extra_porcent_base_dmg
        }

        if (effectKey === 'sangrado') {
            const defenderVm = this.bonusEffectService.calculateRetardoEffect(defender.effects, 'vm', defender.stats.general.vm)
            return defenderVm * DAMAGE_EFFECTS_CONFIG[effectKey].extra_porcent_base_dmg_per_vm
        }

        return 0
    }
}