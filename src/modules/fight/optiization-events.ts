import { FightEvent } from "netim2-shared";

//EMPEZO CON 633.68 KB

export interface FightTurnEvents {
    turnNumber: number;
    events: FightEvent[];
}

export interface FightEventsByTurn {
    fightId: string;
    turns: FightTurnEvents[];
}

export const groupFightEventsByTurn = (
    events: FightEvent[]
): FightEventsByTurn => {

    if (events.length === 0) {
        throw new Error(
            'Cannot group fight events because the events array is empty.'
        );
    }

    const fightId = events[0].fightId;

    const turnsMap =
        new Map<number, any[]>();

    for (const event of events) {

        if (event.fightId !== fightId) {
            throw new Error(
                'Cannot group events from different fights.'
            );
        }

        const {
            fightId: _fightId,
            turnNumber,
            eventId: _eventId,
            ...playbackEvent
        } = event;

        const turnEvents =
            turnsMap.get(turnNumber);

        if (turnEvents) {
            turnEvents.push(playbackEvent);
        } else {
            turnsMap.set(
                turnNumber,
                [playbackEvent]
            );
        }
    }

    return {
        fightId,

        turns:
            Array.from(turnsMap.entries())
                .map(
                    ([turnNumber, events]) => ({
                        turnNumber,
                        events
                    })
                )
                .sort(
                    (a, b) =>
                        a.turnNumber -
                        b.turnNumber
                )
    };
};