import { Injectable } from "@nestjs/common";
import { FighterType } from "../types/entites/fight-entity.type";
import { FightDetails } from "../types/entites/fight-details.type";

@Injectable()
export class FightTurnService {

    executeTurn(
        attacker: FighterType,
        defender: FighterType
    ): FightDetails {
        
        
    }
}