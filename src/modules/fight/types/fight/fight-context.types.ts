import { FightEntity } from "../../entities/fight.entity";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FightEvent } from "../fightEvents/fight-event.types";

export interface TurnContext {
    fight: FightEntity;
    actor: FighterCombatEntity;
    turnNumber: number;
    events: FightEvent[]; //Aca iria TurnEvent
}