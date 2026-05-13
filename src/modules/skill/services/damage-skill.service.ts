import { Injectable } from "@nestjs/common";
import { DamageSkillType } from "../types/props/damage-skill.type";
import { CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { SharedSkillService } from "./shared-skill.service";
import { BonusDamageService } from "./bonus-damage.service";
import { SkillDamageEscalado } from "../types/config/skill-damage-escalado.type";

@Injectable()
export class DamageSkillService {

    constructor(
        private sharedSkillService: SharedSkillService,
        private bonusDamageService: BonusDamageService
    ) { }

    updateDamageSkillStats(
        skill: DamageSkillType,
        scaling: SkillDamageEscalado,
        statsGeneral: CharacterStats['general']
    ): DamageSkillType {

        const updatedSkill = { ...skill }

        updatedSkill.daño = this.calculateDmg(updatedSkill, scaling, statsGeneral)
        updatedSkill.bonus_efecto = this.calculateBonusEffect(updatedSkill, scaling)

        if (this.bonusDamageService.hasBonusDamage(updatedSkill.idSkill)) {
            updatedSkill.bonus_damage = this.bonusDamageService.calculateBonusDamage(updatedSkill)
        }

        return updatedSkill
    }

    /**
     * Calcula el daño final mínimo y máximo de una habilidad.
     *
     * @param skill Habilidad que se utilizará para el cálculo.
     * @param scaling Configuración de escalado de la habilidad.
     * @param statsGeneral Estadísticas generales del personaje.
     * @returns Daño mínimo y máximo final de la habilidad.
     */
    calculateDmg(
        skill: DamageSkillType,
        scaling: SkillDamageEscalado,
        statsGeneral: CharacterStats['general']
    ): DamageSkillType["daño"] {

        const basicDmg = this.getBasicDmg(statsGeneral, skill, scaling)
        const attributeBonification = this.sharedSkillService.getAttributeBonification(statsGeneral, scaling.escaladoAtributos)
        const skillLvBonification = this.getSkillLvBonification(skill, scaling)

        return {
            min: Math.trunc((basicDmg.min + skillLvBonification) * attributeBonification),
            max: Math.trunc((basicDmg.max + skillLvBonification) * attributeBonification),
        }
    }

    calculateBonusEffect(
        skill: DamageSkillType,
        scaling: SkillDamageEscalado
    ): DamageSkillType["bonus_efecto"] {

        const lvPoints = this.sharedSkillService.getPointsLvBonification(skill.lv)

        const skillEffects = { ...skill.bonus_efecto }

        for (const effectKey of Object.keys(skillEffects) as Array<keyof typeof scaling.escaladoEfecto>) {

            const effectScaling = scaling.escaladoEfecto[effectKey]

            if (!effectScaling) {
                throw new Error(`No se encuentra el escalado del efecto ${effectKey}`)
            }

            skillEffects[effectKey] = effectScaling.base + (effectScaling.perLv * lvPoints)
        }

        return skillEffects
    }

    /**
     * Obtiene el daño base de la habilidad antes de aplicar
     * bonificaciones por atributos y nivel de habilidad.
     *
     * Si la habilidad es física (`ad`) utiliza el ataque físico.
     * Si es mágica (`ap`) utiliza el ataque mágico.
     *
     * @param statsGeneral Estadísticas generales del personaje.
     * @param skill Habilidad utilizada.
     * @param scaling Configuración de escalado principal de la habilidad.
     * @returns Daño base mínimo y máximo.
     */
    private getBasicDmg(
        statsGeneral: CharacterStats['general'],
        skill: DamageSkillType,
        scaling: SkillDamageEscalado
    ): { min: number, max: number } {

        const basicDmg = { min: 0, max: 0 }

        if (skill.tipo_daño === 'ad') {
            basicDmg.min = statsGeneral.ad.min * scaling.escaladoMain.min
            basicDmg.max = statsGeneral.ad.max * scaling.escaladoMain.max
        } else {
            basicDmg.min = statsGeneral.ap.min * scaling.escaladoMain.min
            basicDmg.max = statsGeneral.ap.max * scaling.escaladoMain.max
        }

        return basicDmg
    }

    /**
     * Calcula la bonificación de daño otorgada
     * por el nivel actual de la habilidad.
     *
     * Tiene en cuenta:
     * - Los puntos efectivos de la habilidad
     * - El multiplicador según el rango de maestría
     *
     * @param skill Habilidad utilizada.
     * @param scaling Configuración de escalado por nivel.
     * @returns Bonificación plana de daño.
     */
    private getSkillLvBonification(skill: DamageSkillType, scaling: SkillDamageEscalado): number {

        const lvPoints = this.sharedSkillService.getPointsLvBonification(skill.lv)

        const multi = this.sharedSkillService.getMultiMasteryLvBonification(skill.lv, scaling.escaladoLv)

        return (lvPoints * scaling.escaladoLv.perLv) * multi
    }
}