import { Injectable } from "@nestjs/common";
import { FightEngine } from "../engine/fight-engine";
import { FighterCombatFactory } from "../factories/fighter-combat-entity.factory";
import { BASE_FIGHT_CONFIG } from "src/modules/character/const/characterProps/base-fight-config.const";
import { GENERAL_CHARACTER_STATS, GENERAL_MOB_STATS } from "src/modules/character/const/characterProps/base-character-stats.const";
import { UNIQUE_ID_SKILLS } from "netim2-shared";

@Injectable()
export class LabFightService {
    constructor(
        private fightEngine: FightEngine,
        private fighterCombatFactory: FighterCombatFactory
    ) { }

    fightLab() {
        try {
            console.log('llego pelea');

            const { fighterA, fighterB, fighterC } = this.getFighter()
            const result = this.fightEngine.executeLab([fighterA], [fighterB], 10)
            console.dir(result.result, { depth: null });
            console.dir(result.initiativeResults, { depth: null });
            console.dir(result.fighters, { depth: null });
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
                        turns: 4,
                        type: 'turns'
                    },
                    description: '',
                    id: UNIQUE_ID_SKILLS.AURA_DE_ESPADA,
                    lv: 1,
                    mana: { initialAmount: 10, amountPerTurn: 3, type: 'upkeep' },
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