import { FightEntity } from "../../entities/fight.entity";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export interface TurnContext {
    fight: FightEntity;
    actor: FighterCombatEntity;
    turnNumber: number;
    events: any[]; //Aca iria TurnEvent
}