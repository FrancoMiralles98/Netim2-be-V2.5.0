import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SharedSkillService } from "../shared-skill.service";
import { BonusRefKeys, CharacterRace, CharacterSpeciality, CharacterStats, DurationConfig, EscaladoStat, MasteryLvRank, SkillAura, SkillAuraScaling } from "netim2-shared";
import { isSkillAuraScaling } from "../../types/skills.guards";

@Injectable()
export class AuraSkillService {

    constructor(
        private sharedSkillService: SharedSkillService
    ) { }

    getUpdatedAura(
        skill: SkillAura,
        stats: CharacterStats,
        race: CharacterRace,
        speciality: CharacterSpeciality
    ): SkillAura {
        const scaling = this.sharedSkillService.getSkillScalingInfo(skill.id, race, speciality)
        if (!isSkillAuraScaling(scaling)) {
            throw new InternalServerErrorException(`La skill ${skill.id} no posee una configuración de escalado de aura válida`)
        }
        return this.buildUpdatedAura(skill, scaling, stats)

    }

    private buildUpdatedAura(skill: SkillAura, scaling: SkillAuraScaling, stats: CharacterStats): SkillAura {
        const lvPoints = this.sharedSkillService.getPointsLvBonification(skill.lv)
        return {
            ...skill,
            cd: scaling.cd,
            duration: this.calculateDurationSkill(skill, scaling, lvPoints),
            mana: this.sharedSkillService.getManaCost(skill.mana, scaling, skill.lv),
            buffos: this.buildBuffos(skill, lvPoints, scaling, stats)
        }
    }

    private buildBuffos(
        skill: SkillAura,
        lvPoints: number,
        scaling: SkillAuraScaling,
        stats: CharacterStats
    ): Partial<Record<BonusRefKeys, number>> {
        const buffos: Partial<Record<BonusRefKeys, number>> = {}

        Object.entries(scaling.escaladoBuffos).forEach(([bonusref, statEscalado]) => {
            buffos[bonusref] = Math.floor(this.calculateBuff(statEscalado, lvPoints, skill.lv, stats.atributos, scaling))
        })

        return buffos
    }


    private calculateBuff(
        statEscalado: EscaladoStat,
        lvPoints: number,
        skillLv: number | MasteryLvRank,
        characterAttributes: CharacterStats['atributos'],
        scaling: SkillAuraScaling,
    ): number {
        const lvMultiplier = this.sharedSkillService.getScalingLvValue(skillLv, statEscalado.escaladoLv)
        const value = statEscalado.base + (statEscalado.escaladoLv.perLv * lvPoints * lvMultiplier)
        if (!this.isDinamicScaling(statEscalado)) {
            return value
        }
        const attributeMultiplier = this.sharedSkillService.getAttributeMultiplier(characterAttributes, scaling.escaladoAtributos)

        return value * attributeMultiplier
    }



    private calculateDurationSkill(skill: SkillAura, scaling: SkillAuraScaling, lvPoints: number): DurationConfig | undefined {
        if (!scaling.duration || !skill.duration) return
        return {
            turns: Math.floor(scaling.duration.base + (lvPoints * scaling.duration.perLv)),
            type: skill.duration.type
        }
    }

    private isDinamicScaling(scalingStat: EscaladoStat): boolean {
        return scalingStat.scaleWithAttribute
    }

}