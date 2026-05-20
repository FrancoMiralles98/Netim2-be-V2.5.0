import { Injectable } from "@nestjs/common";
import { CcEffectDescription, DmgEffectDescription, FighterEffectDescription, FighterType } from "../types/entites/fight-entity.type";
import { BONUS_EEFECTS_CONFIG, CC_EFFECTS_CONFIG, DAMAGE_EFFECTS_CONFIG } from "../config/effects.config";
import { ActionAttackerType } from "../types/services/damage-description.type";
import { CCffectKeys, DamageEffectKeys } from "../types/config/effect-key.types";
import { BonusCCRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class EffectsService {

    constructor(
        private rngService: RngService
    ) {

    }

    calculateEffectPlayer(
        attackerAction: ActionAttackerType,
        attacker: FighterType,
        defender: FighterType
    ): FighterEffectDescription {
        const updatedEffectPlayer = structuredClone(defender.effects)

        updatedEffectPlayer.desmayo = this.getCcPlayerEffect('desmayo',attackerAction,defender)
        updatedEffectPlayer.retardo = this.getCcPlayerEffect('retardo',attackerAction,defender)
        updatedEffectPlayer.incendio = this.getDamagePlayerEffect('incendio',attackerAction,attacker,defender)
        updatedEffectPlayer.sangrado = this.getDamagePlayerEffect('sangrado',attackerAction,attacker,defender)
        updatedEffectPlayer.veneno = this.getDamagePlayerEffect('veneno',attackerAction,attacker,defender)

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

    private getCcPlayerEffect(
        effectKey: BonusCCRefKeys,
        attackerDmg: ActionAttackerType,
        defender: FighterType,
    ): CcEffectDescription {
        const updatedEffect = { ...defender.effects[effectKey] }

        const effectResistance = this.getCcEffectBonus(effectKey,defender)

        if (this.rngService.rollChance(effectResistance)) {
            return updatedEffect
        }

        if (attackerDmg.type_action === 'healing') {
            return updatedEffect
        }

        if (!attackerDmg.effectsChances[effectKey]) {
            return updatedEffect
        }

        return {
            isActive: true,
            turnsRemaining: CC_EFFECTS_CONFIG[effectKey].turns,
            type: 'cc'
        }
    }

    private getDamagePlayerEffect(
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

        const totalBonus = this.getDamageEffectBonus(effectKey, attacker, defender)

        let effectDmg = attackerDmg.dmg * DAMAGE_EFFECTS_CONFIG[effectKey].porcent_base_damage / 100

        effectDmg *= 1 + totalBonus / 100

        return {
            dmgOfEffect: Math.trunc(effectDmg),
            isActive: true,
            turnsRemaining: DAMAGE_EFFECTS_CONFIG[effectKey].turns,
            type: 'damage',
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

    private getDamageEffectBonus(
        effectKey: DamageEffectKeys,
        attacker: FighterType,
        defender: FighterType
    ): number {
        const bonusByEffect: Record<DamageEffectKeys, number> = {
            veneno: attacker.stats.bonus.daño.bonus_veneno,
            incendio: attacker.stats.bonus.daño.bonus_fuego,
            sangrado: attacker.stats.bonus.daño.bonus_sangrado,
        }

        const defenseByEffect: Record<DamageEffectKeys, number> = {
            veneno: defender.stats.bonus.defensa.def_veneno,
            incendio: defender.stats.bonus.defensa.def_incendio,
            sangrado: defender.stats.bonus.defensa.def_sangrado,
        }

        return (bonusByEffect[effectKey] +
            attacker.stats.bonus.daño.bonus_estado -
            defenseByEffect[effectKey]
        )
    }
}