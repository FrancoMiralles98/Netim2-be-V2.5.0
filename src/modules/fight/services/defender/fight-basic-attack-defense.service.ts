import { Injectable } from "@nestjs/common";
import { EffectsService } from "../effects/effect.service";
import { BasicAttackDefenseDescriptionType, defensiveChance } from "../../types/services/defense-description.type";
import { BasicAttackDescriptionType } from "../../types/services/damage-description.type";
import { FighterType } from "../../types/entites/fight-entity.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { BONUS_EFFECTS_CONFIG } from "../../config/effects.config";
import { BonusEffectService } from "../effects/bonus-effect.service";

@Injectable()
export class FightBasicAttackDefenseService {

    constructor(
        private effectService: EffectsService,
        private rngService: RngService,
        private bonusEffect: BonusEffectService
    ) { }

    /**
     * Calcula el daño final que recibirá el defensor
     * luego de aplicar todas las defensas contra un ataque básico.
     *
     * Si el ataque falla, es bloqueado o es esquivado,
     * el daño recibido será `0`.
     *
     * @param attackerDmg Descripción del ataque básico recibido.
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     * @returns Resultado defensivo contra ataque básico.
     */
    reduceBasicAttack(
        attackerDmg: BasicAttackDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): BasicAttackDefenseDescriptionType {
        const defensiveChance = this.calculateDefensiveChance(defender, attacker, attackerDmg)

        if (attackerDmg.missHit || defensiveChance.bloquear_ataques || defensiveChance.esquivar_ataques) {
            return {
                reflectar_dmg: 0,
                type_action: 'def_basic_attack',
                dmgToReceive: 0,
                defensiveChance
            }
        }

        let basicPorcentReduction = this.getBasicPorcentReduction(attacker, defender)
        const specificReductions = this.getSpecificPorcentReduction(attacker, defender)


        //este valor puede verse reducida por el efecto de penetracion
        basicPorcentReduction = this.bonusEffect.calculatePenetracionEffect(
            attackerDmg.effectsChances.penetracion, "bonus_def", basicPorcentReduction)

        //Para evitar bugs de numeros negativos
        const basicReduction = Math.min(Math.max(basicPorcentReduction, 0), 100)
        const specificReduction = Math.min(Math.max(specificReductions, 0), 100)


        let dmgAfterReductions = attackerDmg.dmg * (1 - basicReduction / 100)

        /*el calculo de reduccion de bonus especificos defensivos se hace aparte porque estos bonus
        son un adicional defensivo y si se sumaran con los bonus basicos podria alcanzar o superar el 100%
        de reduccion de daño (cosa que no queremos) */

        dmgAfterReductions *= 1 - specificReduction / 100

        /*la "general_def" se refiere a la armadura que tiene el personaje
        y esta sirve para reducir de manera plana el daño del ataque basico, puede verse
        reducida por penetracion
        */
        const general_def = this.bonusEffect.calculatePenetracionEffect(
            attackerDmg.effectsChances.penetracion,
            "flat_def",
            defender.stats.general.def
        )

        dmgAfterReductions = Math.max(0, dmgAfterReductions - general_def)

        const reflectar_dmg = defensiveChance.reflectar
            ? Math.trunc(attackerDmg.dmg * (BONUS_EFFECTS_CONFIG.reflectar.porcent_dmg_to_reflect / 100))
            : 0


        return {
            reflectar_dmg,
            type_action: 'def_basic_attack',
            dmgToReceive: dmgAfterReductions,
            defensiveChance
        }
    }

    /**
     * Obtiene la reducción porcentual básica contra ataques básicos.
     *
     * Los bonus "basicos" de reduccion de daño son:
     * - Defensa contra el tipo de arma del atacante.
     * - Defensa media general.
     *
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     * @returns Porcentaje total de reducción básica.
     */
    private getBasicPorcentReduction(
        attacker: FighterType,
        defender: FighterType,
    ): number {
        let totalBonus = 0

        totalBonus += defender.stats.bonus.defensa[attacker.type_weapon] || 0
        totalBonus += defender.stats.bonus.defensa.def_media || 0

        return totalBonus
    }

    /**
     * Obtiene la reducción porcentual específica contra el atacante.
     *
     *  Los bonus "especificos" de reduccion de daño son:
     * - Defensa contra el target_type del atacante.
     * - Defensa contra la raza del atacante.
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
    * Calcula las chances defensivas del defensor frente
    * a un ataque básico.
    *
    * Orden de prioridad:
    * 1. Si el atacante falló, no se calculan defensas.
    * 2. Bloquear ataque.
    * 3. Esquivar ataque.
    * 4. Cortar curación.
    * 5. Reflejar daño.
    *
    * @param defender Peleador defensor.
    * @param attacker Peleador atacante.
    * @param attackerDmg Ataque básico recibido.
    * @returns Chances defensivas activadas.
    */
    private calculateDefensiveChance(
        defender: FighterType,
        attacker: FighterType,
        attackerDmg: BasicAttackDescriptionType,
    ): defensiveChance {
        const defensiveChance: defensiveChance = {
            bloquear_ataques: false,
            esquivar_ataques: false,
            corta_curacion: false,
            reflectar: false,
        }

        if (attackerDmg.missHit) {
            return defensiveChance
        }

        defensiveChance.bloquear_ataques = this.rngService.rollChance(
            defender.stats.bonus.defensa.bloquear_ataques,
        )

        if (defensiveChance.bloquear_ataques) {
            return defensiveChance
        }

        defensiveChance.esquivar_ataques = this.calculateEsquivarAtaques(defender)

        if (defensiveChance.esquivar_ataques) {
            return defensiveChance
        }

        defensiveChance.corta_curacion = this.rngService.rollChance(
            defender.stats.bonus.defensa.corta_curacion,
        )

        defensiveChance.reflectar = this.rngService.rollChance(
            defender.stats.bonus.defensa.reflectar,
        )

        return defensiveChance
    }

    /**
     * Determina si el defensor esquiva el ataque básico.
     *
     * La esquiva puede producirse por:
     * - VM actual del defensor.
     *
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     * @returns `true` si el ataque es esquivado.
     */
    private calculateEsquivarAtaques(defender: FighterType): boolean {
        //como retardo afecta la vm, primero se calcula la vm final que tiene antes de saber si esquiva el ataque
        const defenderVm = this.bonusEffect.calculateRetardoEffect(defender.effects, 'vm', defender.stats.general.vm)
        return this.rngService.rollChance(defenderVm)
    }
}