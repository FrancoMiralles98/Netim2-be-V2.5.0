import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { SharedSkillService } from "./shared-skill.service";
import { CharacterRace, CharacterSpeciality, CharacterStats, DamageType, SkillDamage, SkillDamageScaling, SkillDamageStatScaling, UNIQUE_ID_SKILLS } from "netim2-shared";
import { SKILL_SCALING_BY_RACE_CONFIG } from "../config/skillScaling/skill-scaling-by-race.const";
import { isSkillDamageScaling } from "../types/skills.guards";
import { CharacterSharedService } from "src/modules/shared/services/character-shared.service";

@Injectable()
export class DamageSkillService {

    constructor(
        private sharedSkillService: SharedSkillService,
        private sharedCharacterService: CharacterSharedService,
    ) { }

    getUpdatedSkill(
        skill: SkillDamage,
        stats: CharacterStats,
        race: CharacterRace,
        speciality: CharacterSpeciality
    ): SkillDamage {
        const updatedSkill = structuredClone(skill)
        const scalingSkillInfo = this.getSkillScalingInfo(skill.id, race, speciality)
        if (!isSkillDamageScaling(scalingSkillInfo)) {
            throw new InternalServerErrorException(`La skill ${skill.id} no posee una configuración de escalado de daño válida`)
        }
        return updatedSkill
    }

    private updatedSkillStats(skill: SkillDamage, scaling: SkillDamageScaling, stats: CharacterStats): SkillDamage {
        const lvPoints = this.sharedSkillService.getPointsLvBonification(skill.lv)
        return {
            nombre: skill.nombre,
            cd: scaling.cd,
            components: this.getDamage(skill,scaling,stats),
            mana: this.sharedSkillService.getManaCost(skill.mana,scaling,skill.lv),
            description: skill.description,
            id: skill.id,
            lv: skill.lv,
        }
    }

    private getDamage(
        skill: SkillDamage,
        scaling: SkillDamageScaling,
        stats: CharacterStats
    ): SkillDamage['components'] {
        return scaling.components.map(component => {
            const ranges = this.getRangesDamage(component.damageType, stats)
            const statsBonusDamage = this.getStatsBonificationDamage(skill, stats, component.statsScaling)
            const attributeBonification = this.sharedSkillService.getAttributeBonification(stats.atributos, component.escaladoAtributos!)

            return {
                damageType: component.damageType,
                range: {
                    min: Math.trunc((ranges.min + statsBonusDamage) * attributeBonification),
                    max: Math.trunc((ranges.max + statsBonusDamage) * attributeBonification),
                },
                tags: component.tags,
                flags: component.flags,
                statsScaling: [],
            }
        })
    }

    private getRangesDamage(
        damageType: DamageType,
        stats: CharacterStats
    ): { min: number, max: number } {
        if (damageType === 'true') {
            return { min: 0, max: 0 }
        }
        const minRange = damageType === 'ad'
            ? stats.general.ad.min
            : stats.general.ap.min

        const maxRange = damageType === 'ad'
            ? stats.general.ad.max
            : stats.general.ap.max

        return {
            max: maxRange,
            min: minRange
        }
    }

    private getStatsBonificationDamage(
        skill: SkillDamage,
        stats: CharacterStats,
        statsScaling?: SkillDamageStatScaling[],
    ): number {
        if (!statsScaling) return 0
        let bonusDamage = 0
        const pointsLv = this.sharedSkillService.getPointsLvBonification(skill.lv)
        for (const statInfo of statsScaling) {
            const statInCharacter = this.sharedCharacterService.getCharacterStatValue(stats, statInfo.stat)
            if (typeof statInCharacter !== 'number') {
                continue;
            }
            const multiplier = statInfo.base + (pointsLv * statInfo.perLv)
            bonusDamage += Math.trunc(statInCharacter * multiplier)
        }

        return Math.min(0, bonusDamage)
    }


    private getSkillScalingInfo(id: UNIQUE_ID_SKILLS, race: CharacterRace, speciality: CharacterSpeciality) {
        const allSkillsScalingByRace = SKILL_SCALING_BY_RACE_CONFIG[race]
        if (!allSkillsScalingByRace) {
            throw new NotFoundException(`No se encuentra informacion del escalado de la raza: ${race}`)
        }
        const skillScalingInfo = allSkillsScalingByRace[speciality]?.[id]

        if (!skillScalingInfo) {
            throw new NotFoundException(`No se encuentra informacion del escalado de id skill ${id} y especialidad: ${speciality}`)
        }
        return skillScalingInfo
    }


}