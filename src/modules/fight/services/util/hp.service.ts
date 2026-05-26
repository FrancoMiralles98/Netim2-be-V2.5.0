import { Injectable } from "@nestjs/common";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { BONUS_EEFECTS_CONFIG, DAMAGE_EFFECTS_CONFIG } from "../../config/effects.config";

@Injectable()
export class HpService {

    getHealingResult(
        attacker: FighterType,
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
    ): { attackerHealing: number, defenderCortaCura: number } {
        let attackerHealing = this.calculateAttackerHealing(attacker, attackerAction, defenderAction)

        const defenderCortaCura = this.calculateCortaCura(attackerHealing, attacker, defenderAction)

        attackerHealing = Math.max(0, attackerHealing - defenderCortaCura)

        return { attackerHealing, defenderCortaCura }
    }

    calculateAttackerHealedReceived(
        healing: number,
        defenderAction: ActionDefenderType
    ): number {
        return healing - defenderAction.reflectar_dmg
    }

    calculateDefenderDamageReceived(
        dmg: number,
        defenderEffects: FighterEffectDescription
    ): number {
        let totalDmg = 0
        for (const key of Object.keys(defenderEffects) as Array<keyof typeof defenderEffects>) {
            const effect = defenderEffects[key]
            if (typeof effect !== 'object' || effect.type !== 'damage') {
                continue;
            }
            totalDmg += effect.isActive ? effect.dmgOfEffect : 0
        }
        
        return totalDmg + dmg

    }


    private calculateAttackerHealing(
        attacker: FighterType,
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
    ): number {
        let healing = 0

        //Se calcula el total de curacion que obtiene de habilidad o ataque basico
        switch (attackerAction.type_action) {
            case 'healing':
                healing = attackerAction.healing
                break;
            case 'basic_attack':
                healing = defenderAction.dmgToReceive * attacker.stats.bonus.defensa.robo_vida / 100
                break;
            case 'skill': {
                const bonus = attackerAction.effectsChances.vampirismo_hechizo + attacker.stats.bonus.defensa.vampirismo_hechizo
                healing = defenderAction.dmgToReceive * bonus / 100
                break;
            }
            default:
                throw new Error(`Tipo de accion invalido`);
        }

        //Se le suma tambien la regeneracion de Hp del atacante
        healing += attacker.stats.general.hp.max * attacker.stats.general.regen_hp / 100

        return Math.max(0, Math.trunc(healing))
    }


    private calculateCortaCura(
        attackerHealing: number,
        attacker: FighterType,
        defenderAction: ActionDefenderType,
    ): number {
        if (!defenderAction.defensiveChance.corta_curacion) {
            return 0
        }

        let cortaCuraBonusValue = BONUS_EEFECTS_CONFIG.corta_curacion.porcent

        cortaCuraBonusValue += attacker.effects.veneno.isActive
            ? DAMAGE_EFFECTS_CONFIG.veneno.corta_cura_porcent
            : 0


        const totalCortaCura = Math.min(cortaCuraBonusValue, 100)

        return Math.trunc(attackerHealing * totalCortaCura / 100)
    }
}