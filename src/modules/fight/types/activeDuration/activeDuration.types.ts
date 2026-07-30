import { DurationConfig } from "netim2-shared";

//Para el manejo de la duraciond de las auras y de los efectos de estados
export interface createActiveDurationProps {
    type: 'turns' | 'until_no_mana';
    initialTurns?: number;
    remainingTurns?: number;
}

export interface ActiveDurationAdvanceResult {
    type: DurationConfig['type'],
    previousTurns?: number,
    remainingTurns?: number,
    expired?: boolean
}