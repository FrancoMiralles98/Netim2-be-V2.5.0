import { Injectable } from "@nestjs/common";
import { FighterType } from "../../types/entites/fight-entity.type";
import { SkillDmgDescriptionType } from "../../types/services/damage-description.type";
import { SkillDefenseDescriptionType } from "../../types/services/defense-description.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { DEFENSE_BY_WEAPON } from "../../config/bonus.defense-by-weapon.config";
import { BONUS_EFFECTS_CONFIG } from "../../config/effects.config";

@Injectable()
export class FightSkillDefenseService {

    constructor(
        private rngService: RngService
    ) { }

    /**
    * Genera la respuesta defensiva frente a una acción de curación.
    *
    * La curación no recibe daño ni puede reflejar daño,
    * pero puede verse afectada por el efecto `corta_curacion`.
    *
    * @param defender Peleador que recibe la curación.
    * @returns Resultado defensivo de la curación.
    */
    reduceHealing(
        defender: FighterType
    ): SkillDefenseDescriptionType {
        return {
            reflectar_dmg: 0,
            dmgToReceive: 0,
            type_action: 'def_skill',
            defensiveChance: {
                corta_curacion: this.rngService.rollChance(defender.stats.bonus.defensa.corta_curacion)
            }
        }
    }

    /**
    * Calcula la reducción defensiva aplicada contra una habilidad de daño.
    *
    * @param attackerDmg Habilidad de daño recibida.
    * @param attacker Peleador atacante.
    * @param defender Peleador defensor.
    * @returns Resultado defensivo contra la habilidad.
    */
    reduceSkillDamage(
        attackerDmg: SkillDmgDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): SkillDefenseDescriptionType {

        const basicBonusReduction = this.getBasicBonusReduction(attackerDmg, attacker, defender)

        let dmgAfterReductions = attackerDmg.dmg * (1 - basicBonusReduction / 100)

        /*el calculo de reduccion de bonus especificos defensivos se hace aparte porque estos bonus
        son un adicional defensivo y si se sumaran con los bonus basicos podria alcanzar o superar el 100%
        de reduccion de daño (cosa que no queremos) */
        const specificReductions = this.getSpecificPorcentReduction(attacker, defender)

        dmgAfterReductions *= 1 - specificReductions / 100

        const reflectar_dmg = this.rngService.rollChance(defender.stats.bonus.defensa.reflectar)
            ? Math.trunc(attackerDmg.dmg * (BONUS_EFFECTS_CONFIG.reflectar.porcent_dmg_to_reflect / 100))
            : 0

        const potentialSkillReduction = this.calculatePotentialSkillReduction(
            attackerDmg.potentialSkill,
            basicBonusReduction,
            specificReductions
        )

        return {
            dmgToReceive: Math.max(0, dmgAfterReductions),
            reflectar_dmg,
            type_action: 'def_skill',
            defensiveChance: {
                corta_curacion: this.rngService.rollChance(defender.stats.bonus.defensa.corta_curacion)
            },
            potentialSkill: potentialSkillReduction
        }
    }

    /**
    * Obtiene la reducción porcentual base contra una habilidad de daño.
    *
    * Los bonus "basicos" de reduccion son:
    * - def_hab 
    * - def_magia si el daño es AP
    * - armadura por arma si el daño es AD
    * 
    * Estos se pueden ver reducidos por:
    * - penetración de habilidad del atacante
    * - penetración propia de la skill
    *
    * @param attackerDmg Habilidad de daño recibida.
    * @param attacker Peleador atacante.
    * @param defender Peleador defensor.
    * @returns Porcentaje final de reducción base.
    */
    private getBasicBonusReduction(
        attackerDmg: SkillDmgDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): number {

        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa.def_hab

        if (attackerDmg.type_damage === 'ap') {
            totalBonus += defender.stats.bonus.defensa.def_magia
        }

        if (attackerDmg.type_damage === 'ad') {
            const bonusRefKeyByWeapon = DEFENSE_BY_WEAPON[attacker.type_weapon]
            totalBonus += defender.stats.bonus.defensa[bonusRefKeyByWeapon] || 0
        }

        const porcentualReduction = attacker.stats.bonus.daño.penetracion_habilidad +
            attackerDmg.effectsChances.penetracion_habilidad

        // la penetracion es porcentual a la reduccion de daño que tiene
        //si tiene 100 % y la skill penetra 15%, la def final seria de 85%
        const penetration = Math.min(porcentualReduction, 100)

        return totalBonus * (1 - penetration / 100)
    }

    /**
    * Obtiene la reducción porcentual específica contra el atacante.
    *
    * los bonus "especificos" de reduccion son:
    * - defensa contra el tipo de objetivo del atacante
    * - defensa contra la raza del atacante
    *
    * @param attacker Peleador atacante.
    * @param defender Peleador defensor.
    * @returns Porcentaje total de reducción específica.
    */
    private getSpecificPorcentReduction(attacker: FighterType, defender: FighterType): number {
        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa[attacker.target_type] || 0
        totalBonus += defender.stats.bonus.defensa[attacker.raza] || 0

        return totalBonus
    }

    /**
    * Calcula el daño final de una skill potenciadora luego de aplicar
    * las mismas reducciones defensivas que afectaron a la skill principal.
    *
    * @param potentialSkill Skill potenciadora aplicada, si existe.
    * @param basicBonusReduction Reducción base aplicada.
    * @param specificBonusReduction Reducción específica aplicada.
    * @returns Skill potenciadora reducida o `undefined` si no existe.
    */
    private calculatePotentialSkillReduction(
        potentialSkill: SkillDmgDescriptionType['potentialSkill'],
        basicBonusReduction: number,
        specificBonusReduction: number
    ): SkillDefenseDescriptionType['potentialSkill'] | undefined {
        if (!potentialSkill) {
            return undefined
        }

        let finalDmg = potentialSkill.dmgBonificated * (1 - basicBonusReduction / 100)
        finalDmg *= 1 - specificBonusReduction / 100
        finalDmg = Math.max(0, finalDmg)

        return {
            finalDmg,
            idSkill: potentialSkill.idSkill
        }
    }
}