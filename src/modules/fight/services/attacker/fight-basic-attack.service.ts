import { Injectable } from "@nestjs/common";
import { BasicAttackDescriptionType } from "../../types/services/damage-description.type";
import { FightStats } from "../../types/entites/fight-stats.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { EffectsService } from "../effects/effect.service";

@Injectable()
export class FightBasicAttackService {

    constructor(
        private rngService: RngService,
        private effectService: EffectsService
    ) { }

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
                this.effectService.calculateRetardoEffect(attackerEffect, 'va', stats.general.va)),
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

        updatedBasicAttack.dmg = Math.round(updatedBasicAttack.dmg + (updatedBasicAttack.dmg * (totalBonus / 100)))

        if (updatedBasicAttack.effectsChances.critico) {
            //En las stats de los personajes el daño critico esta puesto de esta manera : 200%
            updatedBasicAttack.dmg *=  attacker.stats.bonus.daño.daño_critico / 100
        }

        return updatedBasicAttack
    }

    private getEffectsChance () {
        
    }

    private calculateIfMissHit(
        stats: FightStats,
        attackerEffect: FighterEffectDescription
    ): boolean {
        const actualVa = this.effectService.calculateRetardoEffect(attackerEffect, 'va', stats.general.va)

        if (actualVa >= 0) {
            return false
        }

        /*Cuando el valor de "VA" es negativo , ese valor absoluto es la chance que tiene de errar el ataque
        Ejemplo : si tiene -5% de "va", tiene un 5% de chances de errar el ataque*/
        return this.rngService.rollChance(Math.abs(actualVa))
    }
}