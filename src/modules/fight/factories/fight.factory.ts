import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { randomUUID } from "crypto";
import { CharacterPersistenceWithId } from "netim2-shared";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { FighterCombatFactory } from "./fighter-combat-entity.factory";

@Injectable()
export class FightFactory {

    constructor(
        private fighterCombatFactory: FighterCombatFactory
    ) { }

    createFightAgainstMobs(input: {
        fighters: CharacterPersistenceWithId[],
        mobs: MobModel[],
        maxTurns: number,
        randomSeed?: string
    }
    ): FightEntity {
        if (input.fighters.length < 1 || input.mobs.length < 1) {
            throw new Error('A fight requires at least two fighters.');
        }

        const { allies, enemies } = this.fighterCombatFactory.createSidesWithMobs(input.fighters, input.mobs)

        return new FightEntity({
            allies,
            enemies,
            id: randomUUID(),
            randomSeed: input.randomSeed ?? randomUUID(),
            maxTurns: input.maxTurns
        })

    }
}