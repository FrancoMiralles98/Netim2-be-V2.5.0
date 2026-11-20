import { Injectable } from "@nestjs/common";
import { FightFactory } from "../factories/fight.factory";
import { FightManager } from "../manager/fight-manager";
import { FightResponse, InitialFighterStats } from "netim2-shared";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { FightEntity } from "../entities/fight.entity";
import { InitiativeResolverService } from "../services/resolvers/initiative-resolver.service";
import { InitialAurasProcessorService } from "../services/processors/initial-auras-processor.service";
import { FightOptions } from "../types/fight/fight-options.type";

@Injectable()
export class FightEngine {
    constructor(
        private readonly fightFactory: FightFactory,
        private readonly fightManager: FightManager,
        private readonly initiativeResolverService: InitiativeResolverService,
        private readonly initialAurasProcessor: InitialAurasProcessorService,
    ) { }

    /** Ejecuta ambos bandos y devuelve el resultado completo y los datos de reproducción. */
    execute(allies: FighterCombatEntity[], enemies: FighterCombatEntity[], maxTurns: number, options: FightOptions = {}): FightResponse {
        const fight = this.fightFactory.create(allies, enemies, maxTurns);
        const initialFighters = this.getInitialFightersState(fight);
        const preparation = (options.startWithAuras ?? true)
            ? this.initialAurasProcessor.process(fight)
            : undefined;
        const initiative = this.initiativeResolverService.resolve(fight.getFighters());
        fight.setInitiative(initiative);
        const result = this.fightManager.executeFight(fight, preparation);
        return {
            result: result.result,
            initiativeResults: result.initiativeResults,
            fightPlaybackPayload: result.events,
            initialFighters,
            fighterFightSummary: result.fighters,
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
                            mastery: skill.mastery,
                            description: skill.description,
                            skillId:
                                skill.id,
                            name:
                                skill.nombre,
                                
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
