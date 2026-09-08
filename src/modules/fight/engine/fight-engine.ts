import { Injectable } from "@nestjs/common";
import { FightFactory } from "../factories/fight.factory";
import { FightManager } from "../manager/fight-manager";
import { CharacterPersistenceWithId, InitialFighterStats } from "netim2-shared";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { FightEntity } from "../entities/fight.entity";
import { randomUUID } from "crypto";
import { InitiativeResolverService } from "../services/resolvers/initiative-resolver.service";
import { FightProcessedResult } from "../services/processors/fight-result-processor.types";

@Injectable()
export class FightEngine {
    constructor(
        private readonly fightFactory: FightFactory,
        private readonly fightManager: FightManager,
        private readonly initiativeResolverService: InitiativeResolverService,
    ) { }

    executeLab(allies: FighterCombatEntity[], enemies: FighterCombatEntity[], turns?: number) {
        const fight = new FightEntity({
            allies,
            enemies,
            id: randomUUID(),
            randomSeed: randomUUID(),
            maxTurns: turns || 1
        })

        const initialFighters = this.getInitialFightersState(fight);

        const initiativeResults = this.initiativeResolverService.resolve(fight.getFighters())

        fight.setInitiative(initiativeResults)

        const fightResult = this.fightManager.executeFight(fight);

        return { fightResult, initialFighters }
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

    private getInitialFightersState(
        fight: FightEntity
    ): InitialFighterStats[] {

        return fight.getFighters().map(
            fighter => ({
                fighterId:
                    fighter.id,

                name:
                    fighter.name,

                side:
                    fight.getSideOf(
                        fighter.id
                    ),

                alive:
                    fighter.isAlive(),

                skills:
                    fighter.getSkills().map(
                        skill => ({
                            skillId:
                                skill.id,

                            name:
                                skill.nombre,

                            icon:
                                ''
                        })
                    ),

                resource: {
                    hp: {
                        current:
                            fighter.resources.hp.current,

                        max:
                            fighter.resources.hp.max
                    },

                    mana: {
                        current:
                            fighter.resources.mana.current,

                        max:
                            fighter.resources.mana.max
                    }
                }
            })
        );
    }
}
