import { Injectable } from "@nestjs/common";
import { FightEngine } from "../engine/fight-engine";
import { FighterCombatFactory } from "../factories/fighter-combat-entity.factory";
import { BASE_FIGHT_CONFIG } from "src/modules/character/const/characterProps/base-fight-config.const";
import { GENERAL_CHARACTER_STATS } from "src/modules/character/const/characterProps/base-character-stats.const";

@Injectable()
export class LabFightService {
    constructor(
        private fightEngine: FightEngine,
        private fighterCombatFactory: FighterCombatFactory
    ) { }

    fightLab() {
        const { fighterA, fighterB } = this.getFighter()
        const result = this.fightEngine.executeLab([fighterA], [fighterB])
        console.log('resultado de la pelea', result);

    }


    getFighter() {
        const fighterA = this.fighterCombatFactory.createFighter({
            fightConfig: BASE_FIGHT_CONFIG,
            id: 'gueerero-id',
            name: 'Guerrero',
            skills: [],
            stats: GENERAL_CHARACTER_STATS,
            targetType: 'medio_humanos',
            race: 'guerrero',
            weaponType: 'espada'
        })
        const fighterB = this.fighterCombatFactory.createFighter({
            fightConfig: BASE_FIGHT_CONFIG,
            id: 'mob-id',
            name: 'Perro Salvaje',
            skills: [],
            stats: GENERAL_CHARACTER_STATS,
            targetType: 'animales',
        })
        return { fighterA, fighterB }
    }
}