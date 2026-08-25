import { Injectable } from "@nestjs/common";
import { RngService } from "src/modules/shared/services/rng.service";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ReflectionResult } from "./reflection-resolver.types";
import { BONUS_EFFECTS_CONFIG } from "../../config/bonus-effects.config";
import { DamageResolutionResult } from "./damage-resolver.types";
import { DamageDelivery } from "netim2-shared";

@Injectable()
export class ReflectionResolverService {
    constructor(
        private rngService: RngService
    ) { }

    resolve(input: {
        attacker: FighterCombatEntity;
        target: FighterCombatEntity;
        receivedDamage: number;
        delivery: DamageDelivery;
    }): ReflectionResult | null {
        if (input.delivery === 'reflected' || input.delivery === 'periodic') {
            return null
        }

        if (input.receivedDamage <= 0) {
            return null;
        }

        const reflectChances = input.target.getEffectiveStatValue('bonus.defensa.reflectar')

        if (reflectChances <= 0) {
            return null
        }

        const roll = this.rngService.rollChance(reflectChances)

        if (!roll) {
            return null
        }

        const reflectedDamage = Math.floor(input.receivedDamage * BONUS_EFFECTS_CONFIG.reflect_porcent_dmg)

        if (reflectedDamage <= 0) {
            return null;
        }

        return {
            source: input.target,
            target: input.attacker,
            damage: reflectedDamage,
            damageType: 'true',
            delivery: 'reflected',
            chance: reflectChances,
            roll
        };
    }

    reflectionDmgResultRegister(
        source: FighterCombatEntity,
        result: DamageResolutionResult
    ) {
        source.statistics.registerDamageDealt({
            amount: result.effectiveDamage,
            damageType: 'true',
            delivery: 'reflected',
            source: { type: 'reflected' }
        })

        source.statistics.registerDefensiveHit({
            result: 'reflected'
        })
    }
}