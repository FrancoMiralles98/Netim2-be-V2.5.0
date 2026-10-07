import { Injectable } from "@nestjs/common";
import { RngService } from "src/modules/shared/services/rng.service";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

@Injectable()
export class CriticalDamageResolverService {
    constructor(
        private rngService: RngService
    ) { }

    resolve(attacker: FighterCombatEntity): { critical: boolean, multiplier: number } {
        const effectiveStats = attacker.effectiveStats

        const critical = this.rngService.rollChance(effectiveStats.bonus.daño.critico)

        if (!critical) {
            return {
                critical,
                multiplier: 1
            }
        }

        return {
            critical,
            multiplier: effectiveStats.bonus.daño.daño_critico
        }
    }
}