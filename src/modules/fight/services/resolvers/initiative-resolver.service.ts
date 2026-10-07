import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FighterInitiativeResult } from "../../types/fight/fight.type";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class InitiativeResolverService {
    constructor(
        private rngService: RngService
    ){}

    resolve(fighters: readonly FighterCombatEntity[]): FighterInitiativeResult[] {

        return fighters.map(fighter => {
            const diceRoll = this.rngService.randomNumberInRange(1, 20);
            const tieBreakerRoll = this.rngService.randomNumberInRange(1, 100);

            return {
                fighterId: fighter.id,
                diceRoll,
                tieBreakerRoll,
                total: diceRoll
            };
        });
    }
}