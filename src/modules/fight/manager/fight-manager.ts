import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { SideTurnExecutionResult } from "../types/side/side.types";
import { SideTurnManager } from "./side-turn-manger";
import { FightResultProcessorService } from "../services/processors/fight-result-processor.service";
import { FightProcessedResult } from "../services/processors/fight-result-processor.types";
import { CombatAction, FightPlaybackPayload, FightPlaybackTurn } from "netim2-shared";

@Injectable()
export class FightManager {
    constructor(
        private readonly sideTurnManager: SideTurnManager,
        private readonly fightResultProcessorService: FightResultProcessorService,
    ) { }

    executeFight(
        fight: FightEntity
    ): FightProcessedResult {

        if (fight.status === 'pending') {
            fight.start();
        }

        const turns: SideTurnExecutionResult[] = [];

        const fightPlaybackPayload: FightPlaybackPayload = {
            fightId: fight.id,
            turns: []
        };

        while (!fight.isFinished) {

            const turn =
                this.sideTurnManager.executeNextTurn(
                    fight
                );

            turns.push(turn);

            /*
             * Creamos el bloque correspondiente
             * a este turno.
             */
            const playbackTurn: FightPlaybackTurn = {
                turnNumber: turn.turnNumber,

                fighterTurns:
                    turn.actions.map(action => ({
                        events: action.events,
                        fighterId: action.actorId,
                        targetId: this.getActionTargetIds(action.action, action.actorId)
                    }))
            };

            fightPlaybackPayload.turns.push(
                playbackTurn
            );
        }

        fightPlaybackPayload.result =
            fight.result;

        return this.fightResultProcessorService.process(
            fight,
            turns,
            fightPlaybackPayload
        );
    }

    private getActionTargetIds(
        action: CombatAction,
        actorId: string
    ): string {

        switch (action.type) {

            case 'basic_attack':
            case 'use_damage_skill':
            case 'use_healing_skill':
            case 'cast_buff':
                return action.targetId;

            case 'cast_aura':
            case 'skip_turn':
                return actorId;
        }
    }
}


