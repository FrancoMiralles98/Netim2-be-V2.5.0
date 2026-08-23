import { Injectable } from "@nestjs/common";
import { BasicAttackHitResolution } from "../../types/actionResolution/action-resolution.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { RngService } from "src/modules/shared/services/rng.service";
import { ContextualBonusService } from "../contextual-bonus.service";
import { CriticalDamageResolverService } from "./critical-damage-resolver.service";
import { DamageResolverService } from "./damage-resolver.service";

@Injectable()
export class BasicAttackHitResolverService {
    constructor(
        private rngService: RngService,
        private contextualBonusService: ContextualBonusService,
        private criticalDamageResolverService: CriticalDamageResolverService,
        private damageResolverService: DamageResolverService,
    ) { }

    resolveHit(input: {
        attacker: FighterCombatEntity;
        target: FighterCombatEntity;

        hitIndex: number;

        missChance: number;
    }): BasicAttackHitResolution {

        const hpBefore = input.target.getCurrentHp();

        if (input.missChance > 0 && this.rngService.rollChance(input.missChance)) {
            /**
             * registro de la estadiscitca de errado el basico ?
             */
            return this.createUnsuccessfulHit({
                hitIndex: input.hitIndex,
                dodgeChance: 0,
                blockChance: 0,
                missChance: input.missChance,
                outcome: 'missed',
                hp: hpBefore
            })
        }

        const dodgeChance = this.contextualBonusService.getDodgeChance(input.target)

        if (this.rngService.rollChance(dodgeChance)) {
            /**
             * registro de la estadiscitca de esquivado el basico ?
             */
            return this.createUnsuccessfulHit({
                hitIndex: input.hitIndex,
                dodgeChance: dodgeChance,
                blockChance: 0,
                missChance: input.missChance,
                outcome: 'dodged',
                hp: hpBefore
            })
        }

        const blockChance = this.contextualBonusService.getBlockChance(input.target)

        if (this.rngService.rollChance(blockChance)) {
            /**
             * registro de la estadiscitca de bloqueo el basico ?
             */
            return this.createUnsuccessfulHit({
                hitIndex: input.hitIndex,
                dodgeChance: dodgeChance,
                blockChance: blockChance,
                missChance: input.missChance,
                outcome: 'blocked',
                hp: hpBefore
            })
        }

        const baseDamage = this.rngService.randomNumberInRange(
            input.attacker.effectiveStats.general.ad.min,
            input.attacker.effectiveStats.general.ad.max,
        )

        const contextualBonusDamage = this.contextualBonusService.getPossibleBasicAttakBonusMultiplier(
            input.attacker, input.target
        )        

        const criticalResult = this.criticalDamageResolverService.resolve(input.attacker);

        const modifiedDamage = Math.max(0, Math.floor(
            baseDamage *
            (1 + contextualBonusDamage / 100) *
            criticalResult.multiplier
        ))

        const penetracionChance = this.contextualBonusService.getPenetracionChance(input.attacker)

        const penetracion = this.rngService.rollChance(penetracionChance)

        const damageResult = this.damageResolverService.resolve({
            sourceType: 'basic_attack',
            attacker: input.attacker,
            target: input.target,
            damageType: 'ad',
            damage: modifiedDamage,
            penetracion
        })

        return {
            appliedDamage: damageResult.effectiveDamage,
            baseDamage,
            blockChance,
            blocked: false,
            critical: criticalResult.critical,
            criticalMultiplier: criticalResult.multiplier,
            dodgeChance,
            dodged: false,
            hitIndex: input.hitIndex,
            hpAfter: damageResult.hpAfter,
            hpBefore: damageResult.hpBefore,
            missChance: input.missChance,
            missed: false,
            outcome: 'applied',
            mitigatedDamage: damageResult.mitigatedAmount,
            modifiedDamage,
            penetration: penetracion,
            overkillDamage: damageResult.overkillDamage,
        }

    }


    private createUnsuccessfulHit(input: {
        hitIndex: number;
        outcome: | 'missed' | 'dodged' | 'blocked';
        missChance: number;
        dodgeChance: number;
        blockChance: number;
        hp: number;
    }): BasicAttackHitResolution {
        return {
            hitIndex: input.hitIndex,

            outcome: input.outcome,

            missChance: input.missChance,

            dodgeChance: input.dodgeChance,

            blockChance: input.blockChance,

            missed: input.outcome === 'missed',

            dodged: input.outcome === 'dodged',

            blocked: input.outcome === 'blocked',

            critical: false,
            criticalMultiplier: 1,

            penetration: false,

            baseDamage: 0,
            modifiedDamage: 0,

            mitigatedDamage: 0,
            appliedDamage: 0,
            overkillDamage: 0,

            hpBefore: input.hp,
            hpAfter: input.hp
        };
    }
}