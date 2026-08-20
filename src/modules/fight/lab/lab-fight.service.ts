import { Injectable } from "@nestjs/common";
import { FightEngine } from "../engine/fight-engine";
import { FighterCombatFactory } from "../factories/fighter-combat-entity.factory";
import { BASE_FIGHT_CONFIG } from "src/modules/character/const/characterProps/base-fight-config.const";
import { GENERAL_CHARACTER_STATS, GENERAL_MOB_STATS } from "src/modules/character/const/characterProps/base-character-stats.const";

@Injectable()
export class LabFightService {
    constructor(
        private fightEngine: FightEngine,
        private fighterCombatFactory: FighterCombatFactory
    ) { }

    fightLab() {
        try {
            console.log('llego pelea');

            const { fighterA, fighterB } = this.getFighter()
            const result = this.fightEngine.executeLab([fighterA], [fighterB],4)
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
            skills: [],
            stats: GENERAL_CHARACTER_STATS,
            targetType: 'medio_humanos',
            race: 'chaman',
            weaponType: 'campana'
        })
        const fighterB = this.fighterCombatFactory.createFighter({
            fightConfig: BASE_FIGHT_CONFIG,
            id: 'mob-id',
            name: 'Perro Salvaje',
            skills: [],
            stats: GENERAL_MOB_STATS,
            targetType: 'monstruos',
            race: 'chaman'
        })
        return { fighterA, fighterB }
    }
}