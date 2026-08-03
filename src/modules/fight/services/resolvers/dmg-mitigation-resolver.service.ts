import { Injectable } from "@nestjs/common";
import { SharedFightService } from "../shared-fight.service";
import { DamageType, SkillDamage } from "netim2-shared";
import { ContextualBonusService } from "../contextual-bonus.service";
import { DmgMitigationResult, ResolveDmgMitigationInput, ResolveSkillMitigationInput } from "./dmg-mitigation-resolver.types";

@Injectable()
export class DmgMitigationResolverService {
    constructor(
        private sharedFightService: SharedFightService,
        private contextualBonusService: ContextualBonusService
    ) { }

    resolve(
        input: ResolveDmgMitigationInput
    ): DmgMitigationResult {
        const requestedDamage = this.sharedFightService.normalizeValue(input.damage);

        if (requestedDamage === 0 || input.damageType === 'true') {
            return this.createBypassedResult(requestedDamage, input.damageType);
        }

        switch (input.sourceType) {
            case 'basic_attack':
                return this.resolveBasicAttackMitigation(
                    input,
                    requestedDamage
                );

            case 'skill':
                return this.resolveSkillMitigation({
                    attacker: input.attacker,
                    damage: requestedDamage,
                    damageType: input.damageType,
                    skill: input.skill,
                    sourceType: "skill",
                    target: input.target
                }
                );
            case 'status_effect':
                return this.resolveStatusEffectMitigation(
                    input,
                    requestedDamage
                );

            case 'reflected':
                return this.createBypassedResult(requestedDamage, input.damageType);

            default:
                return this.assertNever(input);
        }
    }


    

    resolveSkillMitigation({ attacker,
        damage,
        damageType,
        target,
        skill
    }: ResolveSkillMitigationInput): DmgMitigationResult {
        const requestedDmg = this.sharedFightService.normalizeValue(damage)

        if (requestedDmg === 0 || damageType === 'true') {
            return this.createBypassedResult(requestedDmg, damageType)
        }

        const rawBonusDefensePercent = this.contextualBonusService.
            getPossibbleSkillBonusMitigationPorcent(attacker, target, damageType)

        const effectiveBonusDefensePercent = this.calculateEffectiveSkillBonusDefense(
            rawBonusDefensePercent,
            skill)

        const damageAfterBonusDefense = requestedDmg * (1 - effectiveBonusDefensePercent / 100)
        const damageAfterMitigation = Math.max(0, Math.floor(damageAfterBonusDefense))

        const mitigatedAmount = requestedDmg - damageAfterMitigation

        return {
            mitigatedAmount,
            damageAfterMitigation,
            rawBonusDefensePercent,
            effectiveBonusDefensePercent,
            fullyMitigated: damageAfterMitigation === 0,
            requestedDamage: requestedDmg,
            damageType
        }

    }


    private createBypassedResult(requestedDamage: number, damageType: DamageType): DmgMitigationResult {
        return {
            requestedDamage: requestedDamage,
            damageType: damageType,
            rawBonusDefensePercent: 0,
            effectiveBonusDefensePercent: 0,
            mitigatedAmount: 0,
            damageAfterMitigation: requestedDamage,
            fullyMitigated: requestedDamage === 0
        };
    }

    private calculateEffectiveSkillBonusDefense(rawBonusDefensePercent: number, skill: SkillDamage): number {
        if (!skill.mechanicsEffects) return rawBonusDefensePercent
        if (!skill.mechanicsEffects.penetracion_habilidad) return rawBonusDefensePercent
        return Math.max(
            0, Math.floor(
                rawBonusDefensePercent * (1 - skill.mechanicsEffects.penetracion_habilidad)
            )
        )

    }
}