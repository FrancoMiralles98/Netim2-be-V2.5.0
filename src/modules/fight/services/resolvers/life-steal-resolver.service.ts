import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { HealingResolution } from "./healing-resolver.types";
import { HealingResolverService } from "./healing-resolver.service";
import { MechanicsEffectsKeys } from "netim2-shared";
import { ContextualBonusService } from "../contextual-bonus.service";

@Injectable()
export class LifeStealResolverService {
    constructor(
        private healingResolverService: HealingResolverService,
        private contextualBonusService: ContextualBonusService,
    ) { }

    resolveSkillLifeSteal(input: {
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        damageDealt: number,
        mechanicsEffects?: Partial<Record<MechanicsEffectsKeys, number>>;
    }): HealingResolution {
        let skillVampirismoEffect = 0
        if (input.mechanicsEffects && input.mechanicsEffects.vampirismo_hechizo) {
            skillVampirismoEffect += input.mechanicsEffects.vampirismo_hechizo
        }

        const totalLifeStealPorcentual =
            this.contextualBonusService.getSkillLifeSteal(input.attacker) +
            skillVampirismoEffect

        const baseHealing = Math.floor(input.damageDealt * (1 + totalLifeStealPorcentual / 100))

        return this.healingResolverService.resolve({
            baseAmount: baseHealing,
            healer: input.attacker,
            source: 'skill'
        })
    }

    resolveBasicAttackLifeSteal(input: {
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        damageDealt: number,
    }): HealingResolution {
        const totalLifeStealPorcentual = this.contextualBonusService.getBasicAttackLifeSteal(input.attacker)
        const baseHealing = Math.floor(input.damageDealt * (1 + totalLifeStealPorcentual / 100))

        return this.healingResolverService.resolve({
            baseAmount: baseHealing,
            healer: input.attacker,
            source: 'robo_vida'
        })
    }
}