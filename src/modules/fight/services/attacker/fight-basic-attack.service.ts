import { Injectable } from "@nestjs/common";
import { BasicAttackDescriptionType } from "../../types/services/damage-description.type";
import { FightStats } from "../../types/entites/fight-stats.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { EffectsService } from "../effects/effect.service";
import { BonusEffectService } from "../effects/bonus-effect.service";

/**
 * Servicio encargado de gestionar la lógica del ataque básico
 * dentro del combate.
 *
 * Responsabilidades:
 * - Generar el daño base del ataque básico.
 * - Determinar si el ataque falla.
 * - Calcular chances de efectos aplicados por ataque básico.
 * - Aplicar bonus ofensivos contra raza, tipo de objetivo.
 * - Aplicar daño crítico si corresponde.
 */
@Injectable()
export class FightBasicAttackService {

    constructor(
        private rngService: RngService,
        private effectService: EffectsService,
        private bonusEffectService : BonusEffectService,

    ) { }

    /**
     * Genera una descripción inicial del ataque básico.
     *
     * Si el ataque falla, el daño será `0` y no se aplicarán efectos.
     * Si es un doble golpe, no puede volver a activar otro doble golpe.
     *
     * @param stats Stats de combate del atacante.
     * @param attackerEffect Efectos actuales del atacante.
     * @param isDobleGolpe Indica si el ataque corresponde a un golpe extra.
     * @returns Descripción del ataque básico generado.
     */
    useBasicAttack(
        stats: FightStats,
        attackerEffect: FighterEffectDescription,
        isDobleGolpe: boolean
    ): BasicAttackDescriptionType {

        const missHit = this.calculateIfMissHit(stats, attackerEffect)

        return {
            dmg: missHit ? 0 : this.rngService.randomNumberInRange(stats.general.ad.min, stats.general.ad.max),
            type_action: 'basic_attack',
            missHit,
            doble_golpe: isDobleGolpe ? false : this.rngService.rollChance(
                this.bonusEffectService.calculateRetardoEffect(attackerEffect, 'va', stats.general.va)),
            effectsChances: {
                desmayo: missHit ? false : this.rngService.rollChance(stats.bonus.cc.desmayo),
                retardo: missHit ? false : this.rngService.rollChance(stats.bonus.cc.retardo),
                incendio: missHit ? false : this.rngService.rollChance(stats.bonus.daño.incendio),
                critico: missHit ? false : this.rngService.rollChance(stats.bonus.daño.critico),
                veneno: missHit ? false : this.rngService.rollChance(stats.bonus.daño.veneno),
                sangrado: missHit ? false : this.rngService.rollChance(stats.bonus.daño.sangrado),
                penetracion: missHit ? false : this.rngService.rollChance(stats.bonus.daño.penetracion),
            }
        }
    }

    /**
     * Aplica los bonus ofensivos correspondientes al ataque básico.
     *
     * Se consideran:
     * - Bonus de daño contra la raza del defensor.
     * - Bonus de daño contra el tipo de objetivo del defensor.
     * - Bonus de daño de media.
     * - Daño crítico si fue activado.
     *
     * @param basicDmg Ataque básico generado previamente.
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     * @returns Ataque básico con daño final actualizado.
     */
    applyBonus(
        basicDmg: BasicAttackDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): BasicAttackDescriptionType {
        const updatedBasicAttack = { ...basicDmg }

        let totalBonus = 0

        totalBonus += attacker.stats.bonus.daño[defender.raza] || 0
        totalBonus += attacker.stats.bonus.daño[defender.target_type] || 0
        totalBonus += attacker.stats.bonus.daño.media

        updatedBasicAttack.dmg = updatedBasicAttack.dmg + (updatedBasicAttack.dmg * (totalBonus / 100))

        if (updatedBasicAttack.effectsChances.critico) {
            //En las stats de los personajes el daño critico esta puesto de manera porcentual => 200% = x2
            updatedBasicAttack.dmg *= attacker.stats.bonus.daño.daño_critico / 100
        }

        updatedBasicAttack.dmg = Math.round(updatedBasicAttack.dmg)

        return updatedBasicAttack
    }

    /**
     * Determina si el ataque básico falla.
     *
     * La velocidad de ataque (va) puede ser negativo ya sea por verse reducida por efectos retardo.
     * o por el tipo de arma que tenga equipada
     * 
     * Si su (va) esta en negativo, ese valor absoluto representa
     * la probabilidad de fallar el ataque.
     *
     * Ejemplo:
     * - va = -5% 
     * implica 5% de probabilidad de fallar.
     *
     * @param stats Stats de combate del atacante.
     * @param attackerEffect Efectos actuales del atacante.
     * @returns `true` si el ataque falla.
     */
    private calculateIfMissHit(
        stats: FightStats,
        attackerEffect: FighterEffectDescription
    ): boolean {
        const actualVa = this.bonusEffectService.calculateRetardoEffect(attackerEffect, 'va', stats.general.va)

        //si tiene va >= 0 no puede fallar el ataque basico
        if (actualVa >= 0) {
            return false
        }

        return this.rngService.rollChance(Math.abs(actualVa))
    }
}