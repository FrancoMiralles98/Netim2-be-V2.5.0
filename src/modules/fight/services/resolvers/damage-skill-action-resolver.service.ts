import { Injectable } from "@nestjs/common";
import { ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { UseDamageSkillAction } from "../../types/combatAction/combat-action.types";
import { DamageHitResolution, DamageSkillActionResolution } from "./dama-skill-action-resolver.types";
import { SharedFightService } from "../shared-fight.service";
import { HitModifiersResolverService } from "./hit-modifiers-resolver.service";
import { DmgModifierResolverService } from "./dmg-modifier-resolver.service";

@Injectable()
export class DamageSkillActionResolver {
    constructor(
        private sharedFightSerivice: SharedFightService,
        private hitModifiersResolverService: HitModifiersResolverService,
        private dmgModifiersResolverService: DmgModifierResolverService

    ) { }

    resolve({ action, context }: ResolveActionInput<UseDamageSkillAction>): DamageSkillActionResolution {
        const skill = context.actor.getSkillById(action.skillId)
        if (!skill || skill.type !== 'damage') {
            throw new Error('Tiene que ser una skill de daño')
        }
        if (!this.sharedFightSerivice.canUseSkill(context.actor, skill)) {
            throw new Error('No puede usar esta skill')
        }
        const target = context.fight.getFighter(action.targetId)
        this.sharedFightSerivice.validateAction({ actor: context.actor, target, skill })

        const manaCost = this.sharedFightSerivice.getInitialManaCost(skill)

        const hitModifierResult = this.hitModifiersResolverService.resolveSkillHitsCount(skill.hitModifiers)
        const dmgModifierResult = this.dmgModifiersResolverService.resolveSkillDamageModifier({
            modifier: skill.damageModifiers,
            source: context.actor,
            target: target
        })

        const hits: DamageHitResolution[] = [];

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        for (let hitIndex = 0; hitIndex < hitModifierResult.hitCount; hitIndex++) {
            if (!target.isAlive()) {
                break;
            }
            /**
             *  const hitResult = this.resolveHit({
                 attacker: actor,
                 target,
                 skill,
                 hitIndex,
                 hitCount,
                 buffDamageMultiplier
             });
 
             hits.push(hitResult);
 
             for (const component of hitResult.components) {
                 totalBaseDamage +=
                     component.baseDamage;
 
                 totalModifiedDamage +=
                     component.modifiedDamage;
 
                 totalMitigatedDamage +=
                     component.mitigatedDamage;
 
                 totalAppliedDamage +=
                     component.appliedDamage;
             }
         }
 
         /*
          * damage_dealt solo se consume si realmente entró
          * al menos un punto de daño.
          *
            if (totalAppliedDamage > 0) {
                this.buffManager.consumeForSkill({
                    target: actor,
                    skillId: skill.id,
                    trigger: 'damage_dealt'
                });
            }

            const statusEffects =
                this.resolveStatusEffects({
                    context,
                    skill,
                    target,
                    totalAppliedDamage
                });

            if (skill.cd.onActivate) {
                actor.startSkillCooldown(
                    skill.id,
                    skill.cd.onActivate
                );
            }

            actor.statistics.registerResources({
                manaSpent: manaSpent.amount
            });

            /*
             * Mantenelo acá únicamente si decidiste que cada
             * resolver registra sus acciones.
             *
             * Si TurnEndProcessor ya registra la acción,
             * eliminá esta llamada.
             *
            actor.statistics.registerSkillUsed();
    
            return {
                type: 'use_damage_skill',
                success: true,
    
                actorId: actor.id,
                targetId: target.id,
                skillId: skill.id,
    
                manaSpent: manaSpent.amount,
                remainingMana: manaSpent.manaAfter,
    
                cooldownRemainingTurns:
                    actor.getSkillRemainingCooldown(
                        skill.id
                    ),
    
                hitCount: hits.length,
                hits,
    
                totalBaseDamage,
                totalModifiedDamage,
                totalMitigatedDamage,
                totalAppliedDamage,
    
                statusEffects,
    
                targetDefeated: !target.isAlive()
            }
                */
        }
    }
}