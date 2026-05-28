import { Injectable } from "@nestjs/common";
import { SkillDamageInFight } from "../../types/entites/fight-details.type";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { HealingDescriptionType, SkillDmgDescriptionType } from "../../types/services/damage-description.type";
import { FightStats } from "../../types/entites/fight-stats.type";
import { CURACION_THRESHLOD } from "../../config/curacion-threshold.config";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";
import { ChanceBonusDamage, DamageSkillType, SkillBonusDamage, TierBonusDamage } from "src/modules/skill/types/props/damage-skill.type";
import { FighterType } from "../../types/entites/fight-entity.type";
import { RngService } from "src/modules/shared/services/rng.service";
import { CC_EFFECTS_CONFIG } from "../../config/effects.config";

@Injectable()
export class FightSkillService {

    constructor(
        private rngService: RngService
    ) { }

    /**
     * Intenta seleccionar una habilidad disponible para usar.
     *
     * Reglas:
     * - La habilidad debe estar aprendida.
     * - No debe estar en cooldown.
     * - Algunas habilidades especiales se validan manualmente.
     * - Curación solo se usa si el HP es suficientemente bajo.
     *
     * Puede retornar:
     * - Una habilidad ofensiva.
     * - Una habilidad de curación.
     * - `false` si no hay habilidades disponibles.
     *
     * @param skillsCanUse Estado de habilidades utilizables.
     * @param skillsStats Información completa de habilidades.
     * @param stats Stats actuales del atacante.
     * @returns Acción de skill generada o `false`.
     */
    tryToSelectSkill(
        skillsCanUse: SkillDamageInFight[],
        skillsStats: SkillType[],
        stats: FightStats
    ): SkillDmgDescriptionType | HealingDescriptionType | false {


        const availableSkill = skillsCanUse.find(skill => {

            /*Se especifica que camulaje no pase porque esta skill se usa en combinacion con otra ya que es una "skill
             potenciadora" */
            if (!skill.isLearned || skill.cdSkill > 0 || skill.idSkill === UNIQUE_ID_SKILLS.CAMUFLAJE) {
                return false
            }

            //Si es curacion se verifica que si tiene sentido que se usa la habilidad
            if (skill.idSkill === UNIQUE_ID_SKILLS.CURACION) {
                return this.needCuracionSkill(stats) ? skill : false
            }

            return true
        })

        if (!availableSkill) {
            return false
        }

        //se busca la info general de la habilidad en la pool del personaje
        const skillInfo = skillsStats.find(skill => skill.idSkill === availableSkill.idSkill)
        if (!skillInfo) {
            throw new Error('Error al encontrar la skill seleccionada')
        }

        if (skillInfo.type === 'Aura') {
            throw new Error(`La skill ${skillInfo.idSkill} seleccionada no puede ser de tipo Aura`)
        }

        if (availableSkill.idSkill === UNIQUE_ID_SKILLS.CURACION) {
            //puede tener curacion critica
            const isCritico = this.rngService.rollChance(stats.bonus.daño.critico)
            const basicHealing = this.rngService.randomNumberInRange(skillInfo.daño.min, skillInfo.daño.max)

            const totalHealing = Math.round( isCritico
                ? basicHealing * stats.bonus.daño.daño_critico / 100
                : basicHealing )

            return {
                type_action: 'healing',
                healing: totalHealing,
                effectsChances: {
                    critico: isCritico,
                },
                idSkill: availableSkill.idSkill,
                cd: skillInfo.cd
            }
        }

        return this.getSkillInfoToUse(skillInfo, skillsCanUse, skillsStats, stats)
    }

    /**
     * Aplica bonus ofensivos a una habilidad de daño.
     *
     * Incluye:
     * - Bonus contra raza.
     * - Bonus contra target type.
     * - Bonus general de habilidad.
     * - Bonus damage especiales.
     * - Crítico.
     * - Skills potenciadoras.
     *
     * @param skillToUse Skill ofensiva base.
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     * @returns Skill actualizada con daño final.
     */
    applyBonus(
        skillToUse: SkillDmgDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ): SkillDmgDescriptionType {

        const skillUpdated = { ...skillToUse }

        let totalBonus = 0

        totalBonus += attacker.stats.bonus.daño[defender.raza] || 0
        totalBonus += attacker.stats.bonus.daño[defender.target_type] || 0
        totalBonus += attacker.stats.bonus.daño.habilidad

        skillUpdated.dmg = Math.round(skillUpdated.dmg + (skillUpdated.dmg * (totalBonus / 100)))

        if (skillToUse.bonus_damage) {
            skillUpdated.dmg *= this.getBonusDamage(skillToUse.bonus_damage)
        }

        if (skillUpdated.effectsChances.critico) {
            skillUpdated.dmg *= attacker.stats.bonus.daño.daño_critico / 100
        }

        //Se calcula el daño que otorga unicamente la skill potenciadora a la skill de daño utilizada
        if (skillUpdated.potentialSkill) {
            const bonusDmg = skillUpdated.dmg * skillUpdated.potentialSkill.bonusToAdd / 100

            skillUpdated.dmg += bonusDmg
            skillUpdated.potentialSkill.dmgBonificated = bonusDmg
        }

        return skillUpdated
    }

    /**
     * Actualiza el cooldown de las habilidades luego
     * de utilizar una skill.
     *
     * También calcula el cooldown de habilidades potenciadoras en caso de usarse
     *
     * @param attacker Atacante que utilizó la skill.
     * @param attackerAction Acción ejecutada.
     * @returns Pool de habilidades actualizado.
     */
    updateCdSkill(
        attacker: FighterType,
        attackerAction: SkillDmgDescriptionType,
    ): SkillDamageInFight[] {
        const updatedSkills = [...attacker.fight_details.skills_used]

        for (const skill of updatedSkills) {
            const totalCdBonus = attacker.stats.general.vh - (attacker.effects.retardo.isActive
                ? CC_EFFECTS_CONFIG.retardo.vh
                : 0
            )

            //Se calcula el cd de la habilidad usada
            if (skill.idSkill === attackerAction.idSkill) {
                skill.cdSkill = Math.max(0,
                    Math.round(attackerAction.cd * (1 - (totalCdBonus / 100))))
            }

            //Si la habilidad usada tambien se activo una habilidad potenciadora se calcula el cd
            if (attackerAction.potentialSkill) {
                if (skill.idSkill === attackerAction.potentialSkill.idSkill) {
                    skill.cdSkill = Math.max(0,
                        Math.round(attackerAction.potentialSkill.cd * (1 - (totalCdBonus / 100))))
                }

            }
        }
        return updatedSkills
    }

    /**
     * Reduce en 1 turno el cooldown de todas las habilidades.
     *
     * @param attacker Peleador que reduce cooldowns.
     * @returns Skills actualizadas.
     */
    reduceCdSkills(
        attacker: FighterType,
    ): SkillDamageInFight[] {
        const updatedSkill = [...attacker.fight_details.skills_used]
        for (const skill of updatedSkill) {
            skill.cdSkill = Math.max(0, skill.cdSkill - 1)
        }

        return updatedSkill
    }

    /**
 * Obtiene el multiplicador de bonus damage
 * correspondiente al tipo configurado.
 *
 * @param bonusDamage Configuración de bonus damage.
 * @returns Multiplicador final de daño.
 */
    private getBonusDamage(bonusDamage: SkillBonusDamage): number {
        return bonusDamage.type === 'chance'
            ? this.calculateChanceBonusDamage(bonusDamage)
            : this.calculateTierBonusDamage(bonusDamage)
    }

    /**
  * Calcula un bonus damage basado en tiers de probabilidad.
  *
  * Solo puede activarse un tier por tirada.
  *
  * @param tierBonusDamage Configuración de bonus por tier.
  * @returns Multiplicador de daño final.
  */
    private calculateTierBonusDamage(tierBonusDamage: TierBonusDamage): number {
        const randomNumber = this.rngService.randomNumberInRange()

        let acc = 0
        let bonification = 1

        for (const bonusDamage of Object.values(tierBonusDamage) as Array<{ chance: number, multi: number }>) {
            if (!bonusDamage) {
                continue
            }

            acc += bonusDamage.chance

            if (randomNumber <= acc) {
                bonification = bonusDamage.multi
                break
            }
        }

        return bonification
    }

    /**
 * Calcula un bonus damage basado en una probabilidad simple.
 *
 * @param chanceBonusDamage Configuración de chance bonus.
 * @returns Multiplicador final de daño.
 */
    private calculateChanceBonusDamage(chanceBonusDamage: ChanceBonusDamage): number {
        return this.rngService.rollChance(chanceBonusDamage.value) ? chanceBonusDamage.multi : 1
    }

    /**
    * Genera la descripción completa de una habilidad ofensiva.
    * @param skillInfo Información de la skill.
    * @param skillsCanUse Estado actual de habilidades.
    * @param allSkills Pool completo de skills.
    * @param stats Stats actuales del atacante.
    * @returns Acción ofensiva de skill.
    */
    private getSkillInfoToUse(
        skillInfo: DamageSkillType,
        skillsCanUse: SkillDamageInFight[],
        allSkills: SkillType[],
        stats: FightStats
    ): SkillDmgDescriptionType {

        return {
            dmg: this.rngService.randomNumberInRange(skillInfo.daño.min, skillInfo.daño.max),
            effectsChances: {
                desmayo: this.rngService.rollChance(skillInfo.bonus_efecto.desmayo),
                incendio: this.rngService.rollChance(skillInfo.bonus_efecto.incendio),
                veneno: this.rngService.rollChance(skillInfo.bonus_efecto.veneno),
                retardo: this.rngService.rollChance(skillInfo.bonus_efecto.retardo),
                critico: this.rngService.rollChance(stats.bonus.daño.critico),
                sangrado: this.rngService.rollChance(skillInfo.bonus_efecto.sangrado),
                penetracion_habilidad: skillInfo.bonus_efecto.penetracion_habilidad,
                vampirismo_hechizo: skillInfo.bonus_efecto.vampirismo_hechizo
            },
            type_damage: skillInfo.tipo_daño,
            cd: skillInfo.cd,
            bonus_damage: skillInfo.bonus_damage ? skillInfo.bonus_damage : undefined,
            idSkill: skillInfo.idSkill,
            type_action: 'skill',
            potentialSkill: this.canUsePotencialSkills(skillsCanUse, allSkills)
        }
    }


    /**
     * Determina si tiene sentido utilizar la habilidad de curación.
     *
     * La skill solo se utilizará si el porcentaje de HP
     * actual es menor o igual al threshold configurado.
     *
     * @param stats Stats actuales del peleador.
     * @returns `true` si debe usar curación.
     */
    private needCuracionSkill(stats: FightStats): boolean {
        const hpPlayer = stats.general.hp
        return hpPlayer.actual * 100 / hpPlayer.max <= CURACION_THRESHLOD
    }


    /**
     * Verifica si existe una habilidad potenciadora disponible.
     *
     * Las habilidades potenciadoras agregan daño adicional
     * a la habilidad ofensiva utilizada.
     * 
     * @note - actualmente solo esta Camuflaje como este tipo de habilidad
     *
     * @param skillsCanUse la lista de habilidades que puede usar en la pelea.
     * @param skillsInfo Información completa de skills.
     * @returns Información de skill potenciadora o `undefined`.
     */
    private canUsePotencialSkills(
        skillsCanUse: SkillDamageInFight[],
        skillsInfo: SkillType[]
    ): SkillDmgDescriptionType['potentialSkill'] {
        const availableSkill = skillsCanUse.find(skill => {

            if (!skill.isLearned || skill.cdSkill > 0) {
                return false
            }

            if (skill.idSkill === UNIQUE_ID_SKILLS.CAMUFLAJE) {
                return true
            }

            return false
        })

        if (availableSkill) {
            const dataOfSkill = skillsInfo.find(skill => skill.idSkill === availableSkill.idSkill) as DamageSkillType

            if (!dataOfSkill || dataOfSkill.type !== 'Daño') {
                throw new Error(`La skill potenciadora ${availableSkill.idSkill} no es válida`)
            }

            return {
                idSkill: availableSkill.idSkill,
                dmgBonificated: 0,
                cd: dataOfSkill.cd,
                bonusToAdd: dataOfSkill.daño.max //es lo mismo el .min o el .max porque los 2 valores deberian ser iguales
            }
        }

        return undefined
    }
}