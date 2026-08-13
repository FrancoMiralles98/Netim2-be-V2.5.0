import { Injectable } from "@nestjs/common";
import { FightFactory } from "../factories/fight.factory";
import { FightManager } from "../manager/fight-manager";
import { CharacterPersistenceWithId } from "netim2-shared";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { FightEntity } from "../entities/fight.entity";
import { randomUUID } from "crypto";

@Injectable()
export class FightEngine {
    constructor(
        private readonly fightFactory: FightFactory,
        private readonly fightManager: FightManager
    ) { }

    executeLab(allies: FighterCombatEntity[], enemies: FighterCombatEntity[]) {
        const fight = new FightEntity({
            allies,
            enemies,
            id: randomUUID(),
            randomSeed: randomUUID(),
            maxTurns: 1
        })

        fight.start()

        while (!fight.isFinished) {
            this.fightManager.executeFight(fight);
        }

        return {
            result: fight.result,
            turns: fight.turnNumber
        };


    }

    executeAgainstMobs(fighters: CharacterPersistenceWithId[], mobs: MobModel[]) {
        const fight = this.fightFactory.createFightAgainstMobs({
            fighters,
            mobs,
            maxTurns: 1,
        })

        fight.start();

        while (!fight.isFinished) {
            this.fightManager.executeFight(fight);
        }

        return {
            result: fight.result,
            turns: fight.turnNumber
        };
    }
}