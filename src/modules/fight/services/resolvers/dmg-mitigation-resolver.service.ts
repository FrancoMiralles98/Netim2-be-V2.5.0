import { Injectable } from "@nestjs/common";
import { SharedFightService } from "../shared-fight.service";
import { DamageType, SkillDamage } from "netim2-shared";
import { ContextualBonusService } from "../contextual-bonus.service";
import { DmgMitigationResult, ResolveBasicAttackMitigationInput, ResolveDmgMitigationInput, ResolveSkillMitigationInput, ResolveStatusEffectMitigationInput } from "./dmg-mitigation-resolver.types";
import { isPeriodicDamageEffectData } from "../../types/statusEffects/effect-data.types";
import { BONUS_EFFECTS_CONFIG } from "../../config/bonus-effects.config";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

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
                return this.resolveBasicAttackMitigation(input);
            case 'skill':
                return this.resolveSkillMitigation({
                    attacker: input.attacker,
                    damage: requestedDamage,
                    damageType: input.damageType,
                    skill: input.skill,
                    sourceType: "skill",
                    target: input.target
                });
            case 'status_effect':
                return this.resolveStatusEffectMitigation(input, requestedDamage);
            case 'reflected':
                return this.createBypassedResult(requestedDamage, input.damageType);
            default:
                throw new Error('No esta supporteado el tipo para la mitigacion de dañof')
        }
    }


    resolveBasicAttackMitigation({
        attacker,
        target,
        damage,
        damageType,
        penetracion,
    }: ResolveBasicAttackMitigationInput
    ): DmgMitigationResult {

        const rawFlatDefense = Math.max(0, target.getEffectiveStatValue('general.def'))
        const rawBonusDefensePercent = this.contextualBonusService.
            getPossibbleBasicAttackBonusMitigationPorcent(attacker, target, damageType)

        const effectiveDefense = penetracion
            ? rawFlatDefense * BONUS_EFFECTS_CONFIG.penetration_flat_defense
            : rawFlatDefense

        const effetiveDefensePercent = penetracion
            ? rawBonusDefensePercent * BONUS_EFFECTS_CONFIG.penetracion_porcentual_defense
            : rawBonusDefensePercent

        /*
   * Primero defensa plana.
   */
        const damageAfterFlatDefense = Math.max(0, damage - effectiveDefense);

        const flatMitigatedAmount = damage - damageAfterFlatDefense;

        /*
         * Después defensa porcentual.
         *
         * Puede ser negativa y aumentar el daño.
         */
        const damageAfterMitigation =
            Math.max(0, Math.floor(damageAfterFlatDefense * (1 - effetiveDefensePercent / 100)));

        return {
            damageAfterMitigation,
            effectiveBonusDefensePercent: effetiveDefensePercent,
            effectiveFlatDefense: effectiveDefense,
            flatMitigatedAmount,
            fullyMitigated: damageAfterMitigation === 0,
            mitigatedAmount: damage - damageAfterMitigation,
            rawBonusDefensePercent,
            rawFlatDefense,
            requestedDamage: damage,
            damageType: 'ad'
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
            attacker,
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
            damageType,
            effectiveFlatDefense: 0,
            flatMitigatedAmount: 0,
            rawFlatDefense: 0
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
            fullyMitigated: requestedDamage === 0,
            effectiveFlatDefense: 0,
            flatMitigatedAmount: 0,
            rawFlatDefense: 0
        };
    }

    private calculateEffectiveSkillBonusDefense(atttacker: FighterCombatEntity, rawBonusDefensePercent: number, skill: SkillDamage): number {
        const characterPenetracion = atttacker.getEffectiveStatValue('bonus.daño.penetracion_habilidad')

        let skillPenetracion = 0
        if (skill.mechanicsEffects && skill.mechanicsEffects.penetracion_habilidad) {
            skillPenetracion = skill.mechanicsEffects.penetracion_habilidad
        }
        const totalPenetration = characterPenetracion + skillPenetracion
        return Math.max(0, Math.floor(
            rawBonusDefensePercent * (1 - (totalPenetration / 100))
        )
        )
    }

    private resolveStatusEffectMitigation(
        input: ResolveStatusEffectMitigationInput,
        requestedDamage: number
    ): DmgMitigationResult {
        const effectData = input.effect.Effectdata;

        if (!isPeriodicDamageEffectData(effectData)) {
            throw new Error(`El efecto ${input.effect.getEffectId()} no produce daño periódico.`);
        }

        const rawBonusDefensePercent =
            this.contextualBonusService.getPossibleStatusEffectMitigationPercent(
                input.target,
                effectData.effectId
            );

        /*
         * Por ahora no hay penetración para los estados.
         * Por eso la defensa efectiva es igual a la defensa base.
         */
        const effectiveBonusDefensePercent = rawBonusDefensePercent

        return this.createPercentageMitigationResult({
            requestedDamage,
            rawBonusDefensePercent,
            effectiveBonusDefensePercent
        });
    }

    private createPercentageMitigationResult(input: {
        requestedDamage: number;
        rawBonusDefensePercent: number;
        effectiveBonusDefensePercent: number;
        damageType?: DamageType;
    }): DmgMitigationResult {

        const damageAfterMitigation = Math.max(0, Math.floor(
            input.requestedDamage * (1 - input.effectiveBonusDefensePercent / 100))
        );

        const mitigatedAmount = input.requestedDamage - damageAfterMitigation;

        return {
            requestedDamage: input.requestedDamage,
            damageType: input.damageType,
            rawBonusDefensePercent: input.rawBonusDefensePercent,
            effectiveBonusDefensePercent: input.effectiveBonusDefensePercent,
            mitigatedAmount,
            damageAfterMitigation,
            fullyMitigated: damageAfterMitigation === 0,
            effectiveFlatDefense: 0,
            flatMitigatedAmount: 0,
            rawFlatDefense: 0
        };
    }
}