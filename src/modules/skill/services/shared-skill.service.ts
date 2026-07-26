import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TOTAL_LV_POINTS_PER_MASTERY_CONFIG } from "../config/total-lv-points-per-mastery.config";
import { CharacterAttribute, CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { CharacterRace, CharacterSpeciality, LetterMasteryLv, MasteryLvRank, SkillAuraScaling, SkillBuffScaling, SkillDamageScaling, SkillManaCost, SkillScalingLv, UNIQUE_ID_SKILLS } from "netim2-shared";
import { SKILL_SCALING_BY_RACE_CONFIG } from "../config/skillScaling/skill-scaling-by-race.const";

@Injectable()
export class SharedSkillService {
    /**
 * Obtiene los puntos efectivos
 * correspondientes al nivel de maestría de la habilidad.
 *
 * Si el nivel es numérico, se considera una habilidad básica.
 * Si es un rango de maestría (`M`, `G`, `P`), se calcula
 * utilizando la configuración de puntos por maestría.
 *
 * @param lv Nivel actual de la habilidad.
 * @returns Puntos efectivos y multiplicador aplicable.
 */
    getPointsLvBonification(lv: MasteryLvRank | number) {

        if (typeof lv === 'number') {
            return lv
        }

        const { letterLv, numberLv } = this.getLetterAndNumberOfMasteryLvRank(lv)

        if (TOTAL_LV_POINTS_PER_MASTERY_CONFIG[letterLv] === undefined) {
            throw new Error(`No se encuentra los lvPoints de la mastria ${letterLv}`)
        }

        //Se hace una separacion con 'P' porque en la config ya esta configurado con los puntos totales
        const points = letterLv === 'P'
            ? TOTAL_LV_POINTS_PER_MASTERY_CONFIG[letterLv]
            : TOTAL_LV_POINTS_PER_MASTERY_CONFIG[letterLv] + numberLv

        return points
    }

    /**
     * Obtiene el multiplicador correspondiente
     * al rango de maestría de la habilidad.
     *
     * @param rank Rango de maestría (`M`, `G` o `P`).
     * @param scaling Configuración de escalado.
     * @returns Multiplicador asociado al rango.
     */
    getMultiMasteryLvBonification(lv: MasteryLvRank | number, escaladoLv: SkillScalingLv): number {

        if (typeof lv === 'number') {
            return escaladoLv.basicMulti
        }

        const { letterLv } = this.getLetterAndNumberOfMasteryLvRank(lv)

        if (letterLv === 'M') {
            return escaladoLv.masterMulti
        }
        if (letterLv === 'G') {
            return escaladoLv.granMasterMulti
        }
        if (letterLv === 'P') {
            return escaladoLv.perfectMulti
        }

        throw new Error('Error al encontrar el rank del escaladoLv')
    }

    /**
 * Separa el rango de maestría y el número
 * del nivel de habilidad.
 *
 * @param skillLv Nivel de maestría de la habilidad.
 * @returns Letra de rango y número de nivel.
 */
    getLetterAndNumberOfMasteryLvRank(skillLv: MasteryLvRank) {
        return {
            numberLv: skillLv === 'P' ? 0 : Number(skillLv.slice(1)),
            letterLv: skillLv.charAt(0) as LetterMasteryLv
        }
    }


    /**
     * Calcula el multiplicador total generado por los atributos
     * escalables de la habilidad.
     *
     * Cada atributo agrega una bonificación porcentual basada en:
     * la suma de los LvPoints y bonusPoints de del atributo en que escala la hab
     *
     * El escalado el es siguiente:
     * @example
     * si escaladoAtributos es : {VIT: 20}
     *  - Se tomara ese valor (20) como porcentaje de dicho atributo que tiene en total el personje
     *  - se sumara al acc (por si tiene mas de un escalado de atributo)
     *  - luego este valor se usara como multiplicador de daño o effecto adicion final
     *  dependiendo si es un aura o una habilidad de daño 
     * Ejemplo:
     *  - Si se tiene 100 puntos de VIT totales y la skill escala con 20% de VIT obtendra:
     *   1.20 = +20% de daño / aumento de effecto de aura
     *
     * @param statsGeneral Estadísticas generales del personaje.
     * @param scaling Configuración de escalado de atributos.
     * @returns Multiplicador final de atributos.
     */
    getAttributeBonification(
        statsGeneral: CharacterStats['atributos'],
        attributeScaling: Partial<Record<CharacterAttribute, number>>
    ): number {
        if (!attributeScaling) return 1
        let bonification = 0
        for (const [attribute, value] of Object.entries(attributeScaling) as [CharacterAttribute, number][]) {

            const attributeCharacter = statsGeneral[attribute]
            const totalAttributeValue = attributeCharacter.bonusPoints + attributeCharacter.lvPoints

            bonification += totalAttributeValue * (value / 100)
        }

        return 1 + bonification / 100
    }


    getManaCost(
        mana: SkillManaCost,
        scaling: SkillAuraScaling | SkillDamageScaling | SkillBuffScaling,
        skillLv: number | MasteryLvRank
    ): SkillManaCost {
        const totalLvPoints = this.getPointsLvBonification(skillLv)
        const totalManaToAdd = scaling.mana.base + (scaling.mana.perLv * totalLvPoints)
        if (mana.type === 'instant') {
            return {
                type: 'instant',
                amount: totalManaToAdd
            }
        }
        if (mana.type === 'upkeep') {
            return {
                type: 'upkeep',
                amountPerTurn: totalManaToAdd / 10, //el costo por turno en 1/10 del total de l activacion
                initialAmount: totalManaToAdd
            }
        }
        return {
            type: 'none'
        }
    }

    meetsMasteryRequirement(
        skillMastery: LetterMasteryLv | null | undefined,
        requiredMastery: LetterMasteryLv
    ): boolean {
        if (!skillMastery) return false
        const masteryRank: Record<LetterMasteryLv, number> = {
            M: 1,
            G: 2,
            P: 3,
        };

        return masteryRank[skillMastery] >= masteryRank[requiredMastery];
    }

    getScalingLvValue(skillLv: number | MasteryLvRank, scalingLv: SkillScalingLv): number {
        const letterLv = typeof skillLv === 'number'
            ? 'N'
            : this.getLetterAndNumberOfMasteryLvRank(skillLv).letterLv

        const reference: Record<LetterMasteryLv | 'N', keyof SkillScalingLv> = {
            N: "basicMulti",
            M: "masterMulti",
            G: "granMasterMulti",
            P: "perfectMulti"
        }

        const referenceToUse = reference[letterLv]

        return scalingLv[referenceToUse]
    }

    getAttributeMultiplier(
        characterAttributes: CharacterStats['atributos'],
        scaling: Partial<Record<CharacterAttribute, number>>
    ): number {
        let multiplier = 1

        for (const [attribute, percentage] of Object.entries(scaling) as Array<[CharacterAttribute, number]>) {
            if (percentage === undefined) continue;

            const attributeValue = characterAttributes[attribute];

            const totalAttributeValue = attributeValue.lvPoints + attributeValue.bonusPoints;

            multiplier += totalAttributeValue * (percentage / 100) / 100;
        }
        return multiplier
    }


    getSkillScalingInfo(id: UNIQUE_ID_SKILLS, race: CharacterRace, speciality: CharacterSpeciality) {
        const allSkillsScalingByRace = SKILL_SCALING_BY_RACE_CONFIG[race]
        if (!allSkillsScalingByRace) {
            throw new InternalServerErrorException(`No se encuentra informacion del escalado de la raza: ${race}`)
        }
        const skillScalingInfo = allSkillsScalingByRace[speciality]?.[id]

        if (!skillScalingInfo) {
            throw new InternalServerErrorException(`No se encuentra informacion del escalado de id skill ${id} y especialidad: ${speciality}`)
        }
        return skillScalingInfo
    }
}