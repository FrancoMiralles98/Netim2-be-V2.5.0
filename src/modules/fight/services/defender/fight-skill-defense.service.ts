import { Injectable } from "@nestjs/common";
import { FighterType } from "../../types/entites/fight-entity.type";
import { SkillDmgDescriptionType } from "../../types/services/damage-description.type";
import { SkillDefenseDescriptionType } from "../../types/services/defense-description.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { DEFENSE_BY_WEAPON } from "../../config/bonus.defense-by-weapon.config";

@Injectable()
export class FightSkillDefenseService {

    constructor(
        private rngService: RngService
    ) {

    }

    reduceHealing(
        defender: FighterType
    ):SkillDefenseDescriptionType {
        return {
            dmgToReceive: 0,
            defensiveChance: {
                corta_curacion:this.rngService.rollChance(defender.stats.bonus.defensa.corta_curacion)
            }
        }
    }

    reduceSkillDamage(
        attackerDmg: SkillDmgDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): SkillDefenseDescriptionType {


        const basicBonusReduction = this.getBasicBonusReduction(attackerDmg, attacker, defender)

        let dmgAfterReductions = attackerDmg.dmg * (1 - basicBonusReduction / 100)

        const specificReductions = this.getSpecificPorcentReduction(attacker, defender)

        dmgAfterReductions *= 1 - specificReductions / 100

        return {
            dmgToReceive: dmgAfterReductions,
            defensiveChance: {
                corta_curacion: this.rngService.rollChance(defender.stats.bonus.defensa.corta_curacion)
            }
        }
    }

    private getBasicBonusReduction(
        attackerDmg: SkillDmgDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): number {

        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa.def_hab
        totalBonus -= attacker.stats.bonus.daño.penetracion_habilidad
        totalBonus -= attackerDmg.effectsChances.penetracion_habilidad

        if (attackerDmg.type_damage === 'ap') {
            totalBonus += defender.stats.bonus.defensa.def_magia
        }

        if (attackerDmg.type_damage === 'ad') {
            const bonusRefKeyByWeapon = DEFENSE_BY_WEAPON[attacker.type_weapon]
            totalBonus += defender.stats.bonus.defensa[bonusRefKeyByWeapon] || 0
        }

        return totalBonus
    }

    private getSpecificPorcentReduction(attacker: FighterType, defender: FighterType): number {
        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa[attacker.target_type] || 0
        totalBonus += defender.stats.bonus.defensa[attacker.raza] || 0

        return totalBonus
    }
}