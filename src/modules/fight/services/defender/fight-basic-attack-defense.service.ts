import { Injectable } from "@nestjs/common";
import { EffectsService } from "../effects/effect.service";
import { BasicAttackDefenseDescriptionType, defensiveChance } from "../../types/services/defense-description.type";
import { BasicAttackDescriptionType } from "../../types/services/damage-description.type";
import { FighterType } from "../../types/entites/fight-entity.type";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class FightBasicAttackDefenseService {

    constructor(
        private effectService: EffectsService,
        private rngService: RngService,
    ) { }

    reduceBasicAttack(
        attackerDmg: BasicAttackDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): BasicAttackDefenseDescriptionType {
        const defensiveChance = this.calculatedefensiveChance(attacker, defender, attackerDmg)

        if (attackerDmg.missHit) {
            return {
                dmgToReceive: 0,
                defensiveChance
            }
        }

        let basicPorcentReduction = this.getBasicPorcentReduction(attacker, defender)

        basicPorcentReduction = this.effectService.calculatePenetracionEffect(
            attackerDmg.effectsChances.penetracion, "bonus_def", basicPorcentReduction)

        let dmgAfterReductions = attackerDmg.dmg * (1 - basicPorcentReduction / 100)

        const specificReductions = this.getSpecificPorcentReduction(attacker, defender)

        dmgAfterReductions *= 1 - specificReductions / 100

        const general_def = this.effectService.calculatePenetracionEffect(
            attackerDmg.effectsChances.penetracion,
            "flat_def",
            defender.stats.general.def
        )

        dmgAfterReductions = Math.max(0, dmgAfterReductions - general_def)

        return {
            dmgToReceive: dmgAfterReductions,
            defensiveChance
        }
    }


    private getBasicPorcentReduction(
        attacker: FighterType,
        defender: FighterType,
    ): number {
        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa[attacker.type_weapon] || 0
        totalBonus += defender.stats.bonus.defensa.def_media || 0

        return totalBonus
    }

    private getSpecificPorcentReduction(attacker: FighterType, defender: FighterType): number {
        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa[attacker.target_type] || 0
        totalBonus += defender.stats.bonus.defensa[attacker.raza] || 0

        return totalBonus
    }


    private calculatedefensiveChance(
        defender: FighterType,
        attacker: FighterType,
        attackerDmg: BasicAttackDescriptionType,
    ): defensiveChance {
        return {
            bloquear_ataques: attackerDmg.missHit ? false : this.rngService.rollChance(defender.stats.bonus.defensa.bloquear_ataques),
            esquivar_ataques: attackerDmg.missHit ? false : this.calculateEsquivarAtaques(attacker, defender),
            corta_curacion: attackerDmg.missHit ? false : this.rngService.rollChance(defender.stats.bonus.defensa.corta_curacion),
            reflectar: attackerDmg.missHit ? false : this.rngService.rollChance(defender.stats.bonus.defensa.reflectar)
        }
    }

    private calculateEsquivarAtaques(attacker: FighterType, defender: FighterType): boolean {
        const attackerVa = this.effectService.calculateRetardoEffect(attacker.effects, 'va', attacker.stats.general.va)
        if (attackerVa < 0) {
            const enemieMissHit = this.rngService.rollChance(attackerVa + 100)
            if (enemieMissHit) {
                return true
            }
        }
        const defenderVm = this.effectService.calculateRetardoEffect(defender.effects, 'vm', defender.stats.general.vm)
        return this.rngService.rollChance(defenderVm)
    }
}