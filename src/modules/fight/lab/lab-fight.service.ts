import { Injectable } from "@nestjs/common";
import { FightEngine } from "../engine/fight-engine";
import { FighterCombatFactory } from "../factories/fighter-combat-entity.factory";
import { BASE_FIGHT_CONFIG } from "src/modules/character/const/characterProps/base-fight-config.const";
import { GENERAL_CHARACTER_STATS, GENERAL_MOB_STATS } from "src/modules/character/const/characterProps/base-character-stats.const";
import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { groupFightEventsByTurn } from "../optiization-events";

@Injectable()
export class LabFightService {
    constructor(
        private fightEngine: FightEngine,
        private fighterCombatFactory: FighterCombatFactory
    ) { }

    fightLab() {
        try {
            const { fighterA, fighterB, fighterC } = this.getFighter()
            const result = this.fightEngine.executeLab([fighterA], [fighterB, fighterC], 500)

            const json = JSON.stringify(result.events);
            const bytes = Buffer.byteLength(json, 'utf8');
            console.log(result.events.length);

            const json1 = JSON.stringify(groupFightEventsByTurn(result.events))
            const bytes1 = Buffer.byteLength(json1, 'utf8');


            console.log(`malo KB: ${(bytes / 1024).toFixed(2)} KB`);
            console.log(`bueno KB: ${(bytes1 / 1024).toFixed(2)} KB`);

            console.log('result', result.result);
        } catch (error) {
            console.log('error de pelea', error);

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
                    cd: { onActivate: 30 },
                    duration: {
                        turns: 20,
                        type: 'turns'
                    },
                    description: '',
                    id: UNIQUE_ID_SKILLS.AURA_DE_ESPADA,
                    lv: 1,
                    mana: { initialAmount: 20, amountPerTurn: 3, type: 'upkeep' },
                    nombre: 'aura',
                    statsModifiers: [{
                        bonusRefKey: 'media',
                        target: 'bonus.daño.media',
                        operation: 'flat',
                        value: 1
                    }],
                    tags: []
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