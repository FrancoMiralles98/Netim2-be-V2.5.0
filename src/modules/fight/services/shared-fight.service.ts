import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { SkillAura, SkillType } from "netim2-shared";

@Injectable()
export class SharedFightService {

    canUseSkill(actor: FighterCombatEntity, skill: SkillType): boolean {
        if (actor.isSkillOnCooldown(skill.id)) {
            return false;
        }

        if (skill.mana.type === 'none') return true

        const initialManaCost = skill.mana.type === 'instant'
            ? skill.mana.amount
            : skill.mana.initialAmount ?? 0

        return actor.hasEnoughMana(initialManaCost);
    }

    getInitialManaCost(skill: SkillType): number {
        switch (skill.mana.type) {
            case 'instant':
                return skill.mana.amount

            case 'upkeep':
                return skill.mana.initialAmount ?? 0
            default:
                throw new Error('No se puede obtener el costo de mana del aura')
        }
    }

    validateAction(input: {
        actor: FighterCombatEntity;
        target: FighterCombatEntity;
        skill: SkillType;
    }): void {
        const { actor, target, skill } = input;

        if (!actor.isAlive()) {
            throw new Error(`Defeated fighter ${actor.id} cannot use a skill.`);
        }

        if (!target.isAlive()) {
            throw new Error(`Cannot attack defeated fighter ${target.id}.`);
        }

        if (actor.id === target.id) {
            throw new Error(`Damage skill ${skill.id} cannot target its caster.`);
        }
    }

    normalizeValue(value: number): number {
        if (!Number.isFinite(value)) {
            throw new Error(`El daño no es válido: ${value}.`);
        }

        return Math.max(0,Math.floor(value));
    }


}