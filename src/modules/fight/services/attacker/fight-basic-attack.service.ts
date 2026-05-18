import { Injectable } from "@nestjs/common";
import { BasicAttackDescriptionType } from "../../types/services/damage-description.type";
import { FightStats } from "../../types/entites/fight-stats.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { FighterType } from "../../types/entites/fight-entity.type";

@Injectable()
export class FightBasicAttackService {

    constructor(
        private rngService: RngService
    ) { }

    useBasicAttack(
        stats: FightStats
    ): BasicAttackDescriptionType {
        return {
            dmg: this.rngService.randomNumberInRange(stats.general.ad.min, stats.general.ad.max),
            type_action: 'basic_attack',
            effectsChances: {
                desmayo: this.rngService.rollChance(stats.bonus.cc.desmayo),
                retardo: this.rngService.rollChance(stats.bonus.cc.retardo),
                incendio: this.rngService.rollChance(stats.bonus.daño.incendio),
                critico: this.rngService.rollChance(stats.bonus.daño.critico),
                veneno: this.rngService.rollChance(stats.bonus.daño.veneno),
                sangrado: this.rngService.rollChance(stats.bonus.daño.sangrado),
                penetracion: this.rngService.rollChance(stats.bonus.daño.penetracion),
                doble_golpe: this.rngService.rollChance(stats.general.va)
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
            updatedBasicAttack.dmg *= attacker.stats.bonus.daño.daño_critico / 100
        }

        return updatedBasicAttack

    }
}