export type ActiveDurationState =
    | ActiveTurnsDuration
    | ActiveUntilNoManaDuration
    | ActivePermanentDuration;

export interface ActiveTurnsDuration {
    type: 'turns';

    initialTurns: number;
    remainingTurns: number;
}

export interface ActiveUntilNoManaDuration {
    type: 'until_no_mana';
}

export interface ActivePermanentDuration {
    type: 'permanent';
}