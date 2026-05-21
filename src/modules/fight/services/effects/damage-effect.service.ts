import { DAMAGE_EFFECTS_CONFIG } from "../../config/effects.config"
import { DamageEffectKeys } from "../../types/config/effect-key.types"
import { DmgEffectDescription, FighterType } from "../../types/entites/fight-entity.type"
import { ActionAttackerType } from "../../types/services/damage-description.type"

export class DamageEffectService {

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
        const defenseBonus = this.getDefenseEffectBonus(effectKey, defender)
        effectDmg *= 1 - defenseBonus / 100

        const totalTurns =
            Math.round(effectConfig.turns * (1 + attacker.stats.bonus.daño.duracion_estado / 100))

        const strongerDamage = Math.max(
            effectDmg,
            updatedEffect.dmgOfEffect,
        )

        return {
            dmgOfEffect: Math.trunc(strongerDamage),
            isActive: true,
            turnsRemaining: totalTurns,
            type: 'damage',
        }
    }

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

    private getExtraPorcentBonusDamage(
        effectKey: DamageEffectKeys,
        defender: FighterType
    ): number {

        if (effectKey === 'incendio' && defender.effects.incendio.isActive) {
            return DAMAGE_EFFECTS_CONFIG[effectKey].extra_porcent_base_dmg
        }

        if (effectKey === 'sangrado') {
            return defender.stats.general.vm * DAMAGE_EFFECTS_CONFIG[effectKey].extra_porcent_base_dmg_per_vm
        }

        return 0
    }
}