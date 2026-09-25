import { Injectable } from "@nestjs/common";
import { FightEngine } from "../engine/fight-engine";
import { FighterCombatFactory } from "../factories/fighter-combat-entity.factory";
import { BASE_FIGHT_CONFIG } from "src/modules/character/const/characterProps/base-fight-config.const";
import { GENERAL_CHARACTER_STATS, GENERAL_MOB_STATS } from "src/modules/character/const/characterProps/base-character-stats.const";
import { FightResponse, UNIQUE_ID_SKILLS } from "netim2-shared";

@Injectable()
export class LabFightService {
    constructor(
        private fightEngine: FightEngine,
        private fighterCombatFactory: FighterCombatFactory
    ) { }

    fightLab(): FightResponse {
        const { fighterA, fighterB, fighterC } = this.getFighter()
        const { fightResult, initialFighters } = this.fightEngine.executeLab([fighterA], [fighterB, fighterC], 10)
        return {
            result: fightResult.result,
            initiativeResults: fightResult.initiativeResults,
            fightPlaybackPayload: fightResult.events,
            initialFighters,
            fighterFightSummary: fightResult.fighters
        }
    }


    getFighter() {
        const fighterA = this.fighterCombatFactory.createFighter({
            fightConfig: BASE_FIGHT_CONFIG,
            id: 'gueerero-id',
            name: 'Guerrero',
            skills: [
                {
                    type: 'aura',
                    cd: { onDeactivate: 10 },
                    description: 'Aumenta el Daño de Media y Robo de Vida',
                    id: UNIQUE_ID_SKILLS.HOJA_ENCANTADA,
                    lv: 1,
                    mana: { type: 'upkeep', initialAmount: 10, amountPerTurn: 50 },
                    mastery: 'G',
                    nombre: 'Hoja Encantada',
                    statsModifiers: [{ bonusRefKey: 'media', operation: 'flat', target: 'bonus.daño.media', value: 100 }],
                    tags: ['aura'],
                    duration: { type: 'until_no_mana' }
                }

            ],
            stats: GENERAL_CHARACTER_STATS,
            targetType: 'medio_humanos',
            race: 'chaman',
            weaponType: 'espada'
        })
        const fighterB = this.fighterCombatFactory.createFighter({
            fightConfig: BASE_FIGHT_CONFIG,
            id: 'mob-id',
            name: 'Perro Salvaje 1',
            skills: [],
            stats: GENERAL_MOB_STATS,
            targetType: 'monstruos',
            race: 'chaman'
        })

        const fighterC = this.fighterCombatFactory.createFighter({
            fightConfig: BASE_FIGHT_CONFIG,
            id: 'segundo-mob-id',
            name: 'Perro Salvaje 2',
            skills: [],
            stats: GENERAL_MOB_STATS,
            targetType: 'monstruos',
            race: 'chaman'
        })
        return { fighterA, fighterB, fighterC }
    }
}