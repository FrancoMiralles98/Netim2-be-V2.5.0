import { Injectable } from "@nestjs/common";
import { FightBasicAttackDefenseService } from "./fight-basic-attack-defense.service";
import { FightSkillDefenseService } from "./fight-skill-defense.service";
import { FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";

@Injectable()
export class DefenderService {

    constructor(
        private fightBasicAttackDefense: FightBasicAttackDefenseService,
        private fightSkillDefense: FightSkillDefenseService
    ){}
    
    /**
     * Ejecuta la acción defensiva correspondiente según
     * el tipo de acción realizada por el atacante.
     *
     * @param attackerDmg Acción generada por el atacante.
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     * @returns Resultado defensivo de la acción recibida.
     *
     * @throws Error si el tipo de acción recibida no es válido.
     */
    executeDefenseAction (
        attackerDmg: ActionAttackerType,
        attacker: FighterType,
        defender: FighterType
    ): ActionDefenderType {

        if (attackerDmg.type_action === 'basic_attack') {
            return this.fightBasicAttackDefense.reduceBasicAttack(attackerDmg,attacker,defender)
        }

        if (attackerDmg.type_action === 'healing') {
            return this.fightSkillDefense.reduceHealing(defender)
        }

        if (attackerDmg.type_action === 'skill') {
            return this.fightSkillDefense.reduceSkillDamage(attackerDmg,attacker,defender)
        }

        throw new Error('El defensor no puede accionar ante el ataque recibido: type_action invalido')
    }
}