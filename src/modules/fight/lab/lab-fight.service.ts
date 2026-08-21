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
            const result = this.fightEngine.executeLab([fighterA], [fighterB], 2)
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
                    id: UNIQUE_ID_SKILLS.GIRO_DE_ESPADA,
                    type: 'damage',
                    cd: { onActivate: 10 },
                    components: [{
                        damageType: 'ad',
                        range: { min: 100, max: 100 },
                        tags: ['ad', 'skill'],
                    }],
                    description: 'gira gira',
                    lv: 1,
                    mana: {type:'instant',amount: 20},
                    nombre: 'Sigue girando',
                    weaponRestricted: ['espada','dos_manos'],
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