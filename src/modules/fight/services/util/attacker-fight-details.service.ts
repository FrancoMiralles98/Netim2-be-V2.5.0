import { Injectable } from "@nestjs/common";
import { ActionAttackerType, HealingDescriptionType, SkillDmgDescriptionType } from "../../types/services/damage-description.type";
import { ActionDefenderType, SkillDefenseDescriptionType } from "../../types/services/defense-description.type";
import { FightDetails } from "../../types/entites/fight-details.type";
import { FighterEffectDescription } from "../../types/entites/fight-entity.type";
import { BONUS_EFFECTS_CONFIG, DAMAGE_EFFECTS_CONFIG } from "../../config/effects.config";

/**
 * Servicio encargado de registrar todas las estadísticas ofensivas
 * generadas por un peleador durante un turno de combate.
 *
 * Responsabilidades:
 * - Registrar daño realizado.
 * - Registrar ataques básicos y skills utilizadas.
 * - Registrar críticos, penetraciones y dobles golpes.
 * - Registrar efectos aplicados.
 * - Registrar curaciones realizadas.
 * - Registrar daño de skills potenciadoras.
 */
@Injectable()
export class AttackerFightDetailsService {


    /**
 * Registra toda la actividad ofensiva realizada durante un turno.
 *
 * Incluye:
 * - acciones ofensivas
 * - efectos aplicados
 * - estadísticas de habilidades utilizadas
 *
 * @param attackerAction Acción realizada por el atacante.
 * @param defenderAction Resultado defensivo del defensor.
 * @param defenderEffects Efectos finales aplicados al defensor.
 * @param attackerEffect Efectos actuales del atacante.
 * @param attackerFightDetails Estadísticas acumuladas del atacante.
 * @param isDobleGolpe Indica si el turno corresponde a un golpe extra.
 */
    registerAttackerTurn(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderEffects: FighterEffectDescription,
        attackerEffect: FighterEffectDescription,
        attackerFightDetails: FightDetails,
        isDobleGolpe: boolean
    ): void {

        this.registerAttackerActions(attackerAction, defenderAction, attackerFightDetails)
        this.registerTurnEffects(attackerFightDetails, defenderEffects, isDobleGolpe)
        if (attackerAction.type_action !== 'basic_attack' && defenderAction.type_action === 'def_skill') {
            this.registerSkillUsed(attackerFightDetails, attackerEffect, attackerAction, defenderAction)
        }
    }

    /**
     * Registra estadísticas relacionadas con acciones ofensivas.
     *
     * @param attackerAction Acción realizada por el atacante.
     * @param defenderAction Resultado defensivo del defensor.
     * @param attackerFightDetails Estadísticas acumuladas del atacante.
     */
    private registerAttackerActions(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        attackerFightDetails: FightDetails,
    ) {
        if (attackerAction.type_action === 'basic_attack') {
            attackerFightDetails.ad_realizado += defenderAction.dmgToReceive
            attackerFightDetails.ad_ataque_basico += defenderAction.dmgToReceive
            attackerFightDetails.ataque_basico_realizado += 1 + (attackerAction.doble_golpe ? 1 : 0)
            attackerFightDetails.ataques_errados += attackerAction.missHit ? 1 : 0
            attackerFightDetails.penetracion_realizado += attackerAction.effectsChances.penetracion ? 1 : 0
            attackerFightDetails.doble_golpe_realizado += attackerAction.doble_golpe ? 1 : 0
        }

        if (attackerAction.type_action === 'skill') {
            if (attackerAction.type_damage === 'ad') {
                attackerFightDetails.ad_realizado += defenderAction.dmgToReceive
            }
            if (attackerAction.type_damage === 'ap') {
                attackerFightDetails.ap_realizado += defenderAction.dmgToReceive
            }
        }
        attackerFightDetails.critico_realizado += attackerAction.effectsChances.critico ? 1 : 0
    }

    /**
     * Registra estadísticas relacionadas con habilidades utilizadas.
     *
     * @param attackerFightDetails Estadísticas acumuladas del atacante.
     * @param attackerEffect Efectos actuales del atacante.
     * @param attackerAction Skill utilizada.
     * @param defensorAction Resultado defensivo del defensor.
     *
     * @throws Error si no se encuentra la skill utilizada.
     */
    private registerSkillUsed(
        attackerFightDetails: FightDetails,
        attackerEffect: FighterEffectDescription,
        attackerAction: SkillDmgDescriptionType | HealingDescriptionType,
        defensorAction: SkillDefenseDescriptionType
    ) {
        const findSkillUsed = attackerFightDetails.skills_used.find(s => s.idSkill === attackerAction.idSkill)

        if (!findSkillUsed) {
            throw new Error('No se encuentra la skill usada para registrar actividad')
        }
        findSkillUsed.timesUsed += 1

        //registro de habilidad de curacion
        if (attackerAction.type_action === 'healing') {
            let cortaCuraBonus = defensorAction.defensiveChance.corta_curacion ?
                BONUS_EFFECTS_CONFIG.corta_curacion.porcent : 0

            cortaCuraBonus += attackerEffect.veneno.isActive
                ? DAMAGE_EFFECTS_CONFIG.veneno.corta_cura_porcent
                : 0

            let healing = attackerAction.healing * (1 - cortaCuraBonus / 100)

            findSkillUsed.Dps += healing
            findSkillUsed.maxDmg = healing > findSkillUsed.maxDmg
                ? healing
                : findSkillUsed.maxDmg

            return
        }

        //registro de potentialSkills
        if (attackerAction.potentialSkill && defensorAction.potentialSkill) {

            const defenderPotencialSkill = defensorAction.potentialSkill

            const findSkillUsed = attackerFightDetails.skills_used.find(s =>
                s.idSkill === defenderPotencialSkill.idSkill)

            if (!findSkillUsed) {
                throw new Error('No se encuentra la skill usada para registrar actividad')
            }

            findSkillUsed.timesUsed += 1
            findSkillUsed.Dps += defenderPotencialSkill.finalDmg
            findSkillUsed.maxDmg = defenderPotencialSkill.finalDmg > findSkillUsed.maxDmg
                ? defenderPotencialSkill.finalDmg
                : findSkillUsed.maxDmg

        }

        //registro de la habilidad usada que causo el daño 
        findSkillUsed.Dps += defensorAction.dmgToReceive
        findSkillUsed.maxDmg = defensorAction.dmgToReceive > findSkillUsed.maxDmg
            ? defensorAction.dmgToReceive
            : findSkillUsed.maxDmg
    }

    /**
    * Registra efectos aplicados durante el turno.
    *
    * Incluye:
    * - cantidad de efectos aplicados
    * - daño realizado por efectos
    * - turnos anulados
    * @param attackerFightDetails Estadísticas acumuladas del atacante.
    * @param defenderEffects Efectos actuales del defensor.
    * @param isDobleGolpe Indica si el turno corresponde a un golpe extra.
    */
    private registerTurnEffects(
        attackerFightDetails: FightDetails,
        defenderEffects: FighterEffectDescription,
        isDobleGolpe: boolean
    ) {
        if (isDobleGolpe) {
            return
        }

        attackerFightDetails.incendio_aplicado += defenderEffects.incendio.isActive ? 1 : 0
        attackerFightDetails.veneno_aplicado += defenderEffects.veneno.isActive ? 1 : 0
        attackerFightDetails.sangrado_aplicado += defenderEffects.sangrado.isActive ? 1 : 0

        attackerFightDetails.incendio_realizado +=
            defenderEffects.incendio.isActive ? defenderEffects.incendio.dmgOfEffect : 0
        attackerFightDetails.veneno_realizado +=
            defenderEffects.veneno.isActive ? defenderEffects.veneno.dmgOfEffect : 0
        attackerFightDetails.sangrado_realizado +=
            defenderEffects.sangrado.isActive ? defenderEffects.sangrado.dmgOfEffect : 0

        attackerFightDetails.retardo_aplicado += defenderEffects.retardo.isActive ? 1 : 0
        attackerFightDetails.turno_anulado += defenderEffects.desmayo.isActive ? 1 : 0
    }

}