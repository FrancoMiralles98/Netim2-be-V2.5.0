import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { SideTurnExecutionResult } from "../types/side/side.types";
import { SideTurnManager } from "./side-turn-manger";
import { FightResultProcessorService } from "../services/processors/fight-result-processor.service";
import { FightProcessedResult } from "../services/processors/fight-result-processor.types";
import type { CombatAction, CombatAttackPlayback, FightPlaybackPayload, FightPlaybackTurn } from 'netim2-shared';
import type { ActionResolution } from '../types/actionResolution/action-resolution.types';

@Injectable()
export class FightManager {
    constructor(
        private readonly sideTurnManager: SideTurnManager,
        private readonly fightResultProcessorService: FightResultProcessorService,
    ) { }

    executeFight(
        fight: FightEntity,
        preparation?: FightPlaybackTurn,
    ): FightProcessedResult {

        if (fight.status === 'pending') {
            fight.start();
        }

        const turns: SideTurnExecutionResult[] = [];
        const initialAuraTurns = new Set(preparation?.fighterTurns.map(turn => turn.fighterId));

        const fightPlaybackPayload: FightPlaybackPayload = {
            fightId: fight.id,
            turns: preparation ? [preparation] : []
        };

        while (!fight.isFinished) {

            const turn =
                this.sideTurnManager.executeNextTurn(
                    fight,
                    initialAuraTurns,
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
                        targetId: this.getActionTargetIds(action.action, action.actorId),
                        attack: this.getAttackPlayback(action.resolution),
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

    /** Expone los hits finales sin recalcular efectos ni estadísticas. */
    private getAttackPlayback(resolution: ActionResolution): CombatAttackPlayback | undefined {
        if (resolution.type !== 'basic_attack' && resolution.type !== 'use_damage_skill') return undefined;
        const hits = resolution.hitResults;
        const totalDirectDamage = hits.reduce((sum, hit) => sum + hit.damage.direct, 0);
        const totalAdditionalDamage = hits.reduce((sum, hit) => sum + hit.damage.additional, 0);
        return {
            source: resolution.type === 'basic_attack' ? { type: 'basic_attack' } : { type: 'skill', skillId: resolution.skillId },
            modifiers: resolution.modifiers, hits, totalDirectDamage, totalAdditionalDamage,
            totalAppliedDamage: totalDirectDamage + totalAdditionalDamage,
            totalHealing: hits.reduce((sum, hit) => sum + hit.healing.effectiveHealing, 0),
            totalReflectedDamage: hits.reduce((sum, hit) => sum + hit.reflectedDamage, 0),
        };
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


