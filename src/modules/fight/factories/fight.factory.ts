import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { randomUUID } from "crypto";

@Injectable()
export class FightFactory {
    createFight(fighters: FighterCombatEntity[], maxTurns: number, randomSeed?: string): FightEntity {
        if (fighters.length < 2) {
            throw new Error('A fight requires at least two fighters.');
        }

        return new FightEntity({
            fighters,
            id: randomUUID(),
            randomSeed: randomSeed ?? randomUUID(),
            maxTurns
        })

    }
}