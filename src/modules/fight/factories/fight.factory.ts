import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { randomUUID } from "crypto";

@Injectable()
export class FightFactory {
    createFight(
        allies: FighterCombatEntity[],
        enemies: FighterCombatEntity[],
        maxTurns: number,
        randomSeed?: string
    ): FightEntity {
        if (allies.length < 1 || enemies.length < 1) {
            throw new Error('A fight requires at least two fighters.');
        }

        return new FightEntity({
            allies,
            enemies,
            id: randomUUID(),
            randomSeed: randomSeed ?? randomUUID(),
            maxTurns
        })

    }
}