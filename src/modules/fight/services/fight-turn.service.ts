import { Injectable } from "@nestjs/common";
import { FighterType } from "../types/entites/fight-entity.type";
import { FightDetails } from "../types/entites/fight-details.type";
import { AttackerService } from "./attacker/attacker.service";

@Injectable()
export class FightTurnService {

    constructor(
        private attackerService: AttackerService
    ) {}

    executeTurn(
        attacker: FighterType,
        defender: FighterType
    ): FightDetails {
        
    }
}