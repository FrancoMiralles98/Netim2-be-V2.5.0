import { Injectable } from '@nestjs/common';
import { FightPlaybackTurn } from 'netim2-shared';
import { FightEntity } from '../../entities/fight.entity';
import { TurnContext } from '../../types/fight/fight-context.types';
import { AuraActionResolverService } from '../resolvers/aura-action-resolver.service';
import { SharedFightService } from '../shared-fight.service';

/** Prepara las auras de ambos bandos; su activación consume la primera acción de cada dueño. */
@Injectable()
export class InitialAurasProcessorService {
    constructor(
        private readonly auraResolver: AuraActionResolverService,
        private readonly sharedFight: SharedFightService,
    ) {}

    /** Activa las auras aprendidas y disponibles, descontando maná en cada activación. */
    process(fight: FightEntity): FightPlaybackTurn | undefined {
        const preparation: FightPlaybackTurn = { turnNumber: 0, fighterTurns: [] };

        for (const actor of fight.getFighters()) {
            if (!actor.isAlive()) continue;

            for (const skill of actor.getSkills()) {
                if (skill.type !== 'aura'
                    || actor.hasActiveAuraBySkillId(skill.id)
                    || !this.sharedFight.canUseSkill(actor, skill)) continue;

                const context: TurnContext = { fight, actor, turnNumber: 0, events: [] };
                const action = { type: 'cast_aura' as const, skillId: skill.id };
                context.events.push({ type: 'action_selected', action });
                this.auraResolver.resolve({ action, context });
                preparation.fighterTurns.push({
                    fighterId: actor.id,
                    targetId: actor.id,
                    events: context.events,
                });
            }
        }

        return preparation.fighterTurns.length > 0 ? preparation : undefined;
    }
}
