import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { UseDamageSkillAction } from "../../types/combatAction/combat-action.types";
import { SharedFightService } from "../shared-fight.service";
import { DamageCalculatorService } from "../damage-calculator.service";
import { SkillDamage, SkillPriorityType, StatusEffectsKeys } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { PERIODIC_DAMAGE_EFFECTS, REFRESHABLE_PRIORITY_EFFECTS } from "../../config/priority-effects.config";

@Injectable()
export class SkillDamageSelectorService {
    constructor(
        private readonly sharedFightService: SharedFightService,
        private readonly damageCalculatorService: DamageCalculatorService
    ) { }

    trySelectAvailableDamageSkill(
        context: TurnContext,
        targetId: string
    ): UseDamageSkillAction | undefined {
        const actor = context.actor
        const target = context.fight.getFighter(targetId)

        let skillDamage = actor.getSkillsDamage()

        let availableSkills = skillDamage.filter(skill => this.sharedFightService.canUseSkill(
            actor,
            skill
        ))

        if (availableSkills.length === 0) {
            return undefined
        }

        /*
         * Si el target ya está desmayado,
         * evitamos gastar otra skill de desmayo
         * siempre que exista alguna alternativa.
         */
        if (
            target.hasActiveStatusEffect('desmayo')
        ) {
            const skillsWithoutStun =
                availableSkills.filter(skill => !this.hasStatusEffect(skill, 'desmayo'))

            if (skillsWithoutStun.length > 0) {
                availableSkills = skillsWithoutStun
            }
        }

        const priorities = actor.fightConfig.self.skillPriority

        const orderedSkills = [...availableSkills].sort((skillA, skillB) =>
            this.compareSkills(
                skillA,
                skillB,
                target,
                actor,
                priorities
            )
        )

        const skill = orderedSkills[0]

        return {
            type: 'use_damage_skill',
            skillId: skill.id,
            targetId
        }
    }

    private compareSkills(
        skillA: SkillDamage,
        skillB: SkillDamage,
        target: FighterCombatEntity,
        actor: FighterCombatEntity,
        priorities: readonly SkillPriorityType[]
    ): number {
        /*
         * PRIMERA prioridad:
         *
         * aprovechar efectos que ya están
         * activos para refrescarlos/apilarlos.
         */
        const statusComparison =
            this.compareActiveStatusSynergy(
                skillA,
                skillB,
                target
            )

        if (statusComparison !== 0) {
            return statusComparison
        }

        /*
         * SEGUNDA prioridad:
         *
         * configuración elegida por el usuario.
         */
        for (const priority of priorities) {
            const comparison =
                this.compareByConfiguredPriority(
                    skillA,
                    skillB,
                    priority,
                    actor
                )

            if (comparison !== 0) {
                return comparison
            }
        }

        return 0
    }

    private compareByConfiguredPriority(
        skillA: SkillDamage,
        skillB: SkillDamage,
        priority: SkillPriorityType,
        actor: FighterCombatEntity
    ): number {
        switch (priority) {
            case 'control':
                return this.compareBoolean(
                    this.hasControl(skillA),
                    this.hasControl(skillB)
                )

            case 'stat_modifier':
                return this.compareBoolean(
                    this.hasStatModifier(skillA),
                    this.hasStatModifier(skillB)
                )

            case 'has_periodicDamage':
                return this.compareBoolean(
                    this.hasPeriodicDamage(skillA),
                    this.hasPeriodicDamage(skillB)
                )

            case 'more_damage':
                return (
                    this.getEstimatedDamage(
                        skillB,
                        actor
                    ) -
                    this.getEstimatedDamage(
                        skillA,
                        actor
                    )
                )

            case 'less_damage':
                return (
                    this.getEstimatedDamage(
                        skillA,
                        actor
                    ) -
                    this.getEstimatedDamage(
                        skillB,
                        actor
                    )
                )

            case 'more_cd':
                return (
                    this.getCooldown(skillB) -
                    this.getCooldown(skillA)
                )

            case 'less_cd':
                return (
                    this.getCooldown(skillA) -
                    this.getCooldown(skillB)
                )

            default:
                throw new Error('no se encuentra suporteado el tipo de prioridad a la hora de elegir una skill')
        }
    }

    private compareBoolean(
        valueA: boolean,
        valueB: boolean
    ): number {
        if (valueA === valueB) {
            return 0
        }

        return valueA ? -1 : 1
    }

    private hasStatusEffect(
        skill: SkillDamage,
        effectId: StatusEffectsKeys
    ): boolean {
        return (skill.statusEffects?.[effectId] !== undefined)
    }

    private hasControl(
        skill: SkillDamage
    ): boolean {
        return this.hasStatusEffect(
            skill,
            'desmayo'
        )
    }

    private hasStatModifier(
        skill: SkillDamage
    ): boolean {
        return this.hasStatusEffect(
            skill,
            'retardo'
        )
    }

    private hasPeriodicDamage(
        skill: SkillDamage
    ): boolean {
        return PERIODIC_DAMAGE_EFFECTS.some(
            effectId =>
                this.hasStatusEffect(
                    skill,
                    effectId
                )
        )
    }

    private getActiveStatusSynergyScore(
        skill: SkillDamage,
        target: FighterCombatEntity
    ): number {
        let score = 0

        for (
            const effectId
            of REFRESHABLE_PRIORITY_EFFECTS
        ) {
            if (
                this.hasStatusEffect(
                    skill,
                    effectId
                ) &&
                target.hasActiveStatusEffect(
                    effectId
                )
            ) {
                score += 1
            }
        }

        return score
    }

    private compareActiveStatusSynergy(
        skillA: SkillDamage,
        skillB: SkillDamage,
        target: FighterCombatEntity
    ): number {
        const scoreA =
            this.getActiveStatusSynergyScore(
                skillA,
                target
            )

        const scoreB =
            this.getActiveStatusSynergyScore(
                skillB,
                target
            )

        return scoreB - scoreA
    }

    private getCooldown(skill: SkillDamage): number {
        return skill.cd.onActivate ?? 0
    }

    private getEstimatedDamage(
        skill: SkillDamage,
        actor: FighterCombatEntity
    ): number {
        const preparedDamage =
            this.damageCalculatorService.prepareSkillDamage(
                actor,
                skill
            )

        return preparedDamage.components.reduce(
            (total, component) => {
                const averageDamage =
                    (
                        component.runtimeScaling.adjustedRange.min +
                        component.runtimeScaling.adjustedRange.max
                    ) / 2

                return total + averageDamage
            },
            0
        )
    }
}