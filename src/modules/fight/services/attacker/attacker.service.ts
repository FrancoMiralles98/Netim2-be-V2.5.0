import { Injectable } from "@nestjs/common";
import { FightSkillService } from "./fight-skill.service";
import { FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { FightBasicAttackService } from "./fight-basic-attack.service";
import { EFFECT_CHANCES_DEFAULT } from "../../const/service/effect-chances.const";


/**
 * Servicio encargado de resolver la acción ofensiva de un peleador
 * durante su turno de combate.
 *
 * Responsabilidades:
 * - Determinar si el atacante puede actuar.
 * - Ejecutar golpe básico, habilidad o curación.
 * - Resolver golpes extra por doble golpe.
 * - Aplicar bonus ofensivos según el tipo de acción.
 */
@Injectable()
export class AttackerService {
    constructor(
        private fightSkillService: FightSkillService,
        private fightBasicAttackService: FightBasicAttackService
    ) { }

    /**
     * Ejecuta la acción de combate del atacante.
     *
     * Flujo:
     * - Si el atacante está desmayado, pierde el turno.
     * - Si es un doble golpe, fuerza un ataque básico (en el doble golpe solo puede ser un ataque
     *  basico, no puede realizar una habilidad).
     * - Si puede usar una habilidad, la ejecuta.
     * - Si no puede usar habilidad, ejecuta ataque básico.
     * - Si la acción genera daño, aplica sus bonus correspondientes.
     *
     * @param attacker Peleador que ejecuta la acción.
     * @param defender Peleador objetivo de la acción.
     * @param isDobleGolpe Indica si la acción corresponde a un golpe extra.
     * @returns Acción ofensiva resultante.
     */
    executeCombatAction(
        attacker: FighterType,
        defender: FighterType,
        isDobleGolpe: boolean //este booleano significa si esta ejecucion es de un doble golpe
    ): ActionAttackerType {

        //Si tiene desmayo activo no hara daño, se devuelvo esto para seguir el flujo
        if (attacker.effects.desmayo.isActive) {
            return {
                type_action : 'basic_attack',
                missHit: true,
                dmg: 0,
                doble_golpe: false,
                effectsChances: {...EFFECT_CHANCES_DEFAULT}
            }
        }

        //Si es doble golpe se realiza el segundo basico correspondiente
        if (isDobleGolpe) {
            const basicAttack =
                this.fightBasicAttackService.useBasicAttack(
                    attacker.stats,
                    attacker.effects,
                    isDobleGolpe
                )

            return this.fightBasicAttackService.applyBonus(
                basicAttack,
                attacker,
                defender
            )
        }

        //si tiene una habilida disponible se ejecuta la habilidad sino un ataque basico
        const action =
            this.fightSkillService.tryToSelectSkill(
                attacker.fight_details.skills_used,
                attacker.hab,
                attacker.stats
            )
            || this.fightBasicAttackService.useBasicAttack(attacker.stats, attacker.effects,isDobleGolpe)

        //Si es una habilidad de curacion simplemente se devuelve (no se tiene bonus extras en curaciones)    
        if (action.type_action === 'healing') {
            return action
        }

        //se suman todos los bonus de daño que se le puede hacer al adversario
        return action.type_action === 'skill'
            ? this.fightSkillService.applyBonus(action, attacker, defender)
            : this.fightBasicAttackService.applyBonus(action, attacker, defender)
    }
}