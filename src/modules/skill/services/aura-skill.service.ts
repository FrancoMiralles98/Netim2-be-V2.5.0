import { Injectable } from "@nestjs/common";
import { AuraSkillType } from "../types/props/aura-skill.type";
import { CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { SharedSkillService } from "./shared-skill.service";
import { EscaladoBuffos, SkillAuraEscalado } from "../types/config/skill-aura-escalado.type";

@Injectable()
export class AuraSkillService {

    constructor(
        private sharedSkillService: SharedSkillService
    ) { }

    /**
    * Actualiza todos los efectos de buffos de una habilidad aura
    * según su configuración de escalado.
    *
    * @param {AuraSkillType} skill aura a actualizar.
    * @param {SkillAuraEscalado} scaling Configuración de escalado de la habilidad.
    * @param {CharacterStats['general']} statsGeneral Stats generales del personaje.
    *
    * @returns {AuraSkillType} Nueva instancia de la habilidad con los buffos actualizados.
    */
    updateAuraEffects(
        skill: AuraSkillType,
        scaling: SkillAuraEscalado,
        statsGeneral: CharacterStats['general']
    ): AuraSkillType {

        const updatedSkill: AuraSkillType = { ...skill, buffos: { ...skill.buffos } }

        for (const bonusRefKey of Object.keys(scaling.escaladoBuffos) as Array<keyof typeof scaling.escaladoBuffos>) {
            if (!scaling.escaladoBuffos[bonusRefKey] || !updatedSkill.buffos[bonusRefKey]) {
                throw new Error('No se encuentra el escalado del buffo seleccionado')
            }
            //Se obtiene los escalados de dicho bonus del aura
            const buffScaling = scaling.escaladoBuffos[bonusRefKey]

            //Se chequea si ese  bonus escala con atributos
            const scaleWithAttribute = buffScaling.scaleWithAtribute
            
            const totalLvPoints = this.sharedSkillService.getPointsLvBonification(updatedSkill.lv)
            const multi = this.sharedSkillService.getMultiMasteryLvBonification(
                skill.lv, buffScaling.escaladoLv)

            const basicEffect = this.calculateBasicScaling(buffScaling, totalLvPoints, multi)

            const value = scaleWithAttribute
                ? this.calculateDinamicScaling(scaling.escaladoAtributos, statsGeneral, basicEffect)
                : basicEffect

            updatedSkill.buffos[bonusRefKey] = Number(value.toFixed(1))
        }

        return updatedSkill
    }


    /**
     * Calcula el efecto base del buff:
     *
     * @param {EscaladoBuffos} bonusScaling Configuración de escalado del buff.
     * @param {number} lvPoints Puntos efectivos del nivel de la habilidad.
     * @param {number} multi Multiplicador del mastery rank.
     *
     * @returns {number} Valor base calculado del efecto.
     */
    private calculateBasicScaling(
        bonusScaling: EscaladoBuffos,
        lvPoints: number,
        multi: number
    ): number {
        return bonusScaling.escaladoLv.perLv * lvPoints * multi
    }

    /**
     * Aplica escalado dinámico al efecto base utilizando
     * los atributos del personaje.
     *
     * @param {SkillAuraEscalado['escaladoAtributos']} attributeScaling
     * Configuración de escalado por atributos.
     *
     * @param {CharacterStats['general']} statsGeneral
     * Stats generales del personaje.
     *
     * @param {number} basicEffect Valor base previamente calculado.
     *
     * @returns {number} Valor final del efecto con escalado dinámico.
     */
    private calculateDinamicScaling(
        attributeScaling: SkillAuraEscalado['escaladoAtributos'],
        statsGeneral: CharacterStats['general'],
        basicEffect: number
    ): number {
        const attributeBonification = this.sharedSkillService.getAttributeBonification(statsGeneral, attributeScaling)

        return basicEffect * attributeBonification
    }
}