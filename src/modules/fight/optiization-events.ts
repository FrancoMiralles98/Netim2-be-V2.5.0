

//EMPEZO CON 633.68 KB
//AHORA CON 282.86 KB

import { FightEvent } from "netim2-shared";

export interface FightTurnEvents {
    turnNumber: number;
    events: FightEvent[];
}

export interface FightEventsByTurn {
    fightId: string;
    turns: FightTurnEvents[];
}