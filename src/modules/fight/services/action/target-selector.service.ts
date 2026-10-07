import { Injectable } from "@nestjs/common"
import { TurnContext } from "../../types/fight/fight-context.types"
import { FighterCombatEntity } from "../../entities/fighter-combat.entity"
import { EnemiePriority } from "netim2-shared/dist/character/character-fight-config.type"
import { RngService } from "src/modules/shared/services/rng.service"

@Injectable()
export class TargetSelectorService {
    constructor(
        private readonly rngService: RngService
    ) { }

    selectTarget(context: TurnContext): string {
        const actor = context.actor

        const opponents = context.fight.getAliveOpponentsOf(actor.id)

        if (actor.fightConfig.enemies.focus) {
            const targetId = actor.getFocusedEnemyId()
            if (targetId) {
                const target = context.fight.getFighter(targetId)
                if (target.isAlive()) {
                    return target.id
                }
                actor.clearFocusedEnemy()
            }
        }

        if (opponents.length === 0) {
            throw new Error(`Fighter ${actor.id} has no alive opponents.`)
        }

        const selector = actor.fightConfig.enemies.selector

        const target = this.selectOpponentBySelector(opponents, selector)

        if (actor.fightConfig.enemies.focus) {
            actor.setFocusedEnemyId(target.id)
        }

        return target.id
    }

    private selectOpponentBySelector(opponents: FighterCombatEntity[], focus: EnemiePriority): FighterCombatEntity {
        switch (focus) {
            case 'random':
                return this.selectRandomOpponent(opponents)

            case 'more_max_hp':
                return this.getOpponentWithHighestMaxHp(opponents)

            case 'less_max_hp':
                return this.getOpponentWithLowestMaxHp(opponents)

            case 'more_hp':
                return this.getOpponentWithHighestCurrentHp(opponents)

            case 'less_hp':
                return this.getOpponentWithLowestCurrentHp(opponents)

            default:
                return this.assertNever(focus)
        }
    }

    private selectRandomOpponent(opponents: FighterCombatEntity[]): FighterCombatEntity {
        const index = this.rngService.randomNumberInRange(0, opponents.length - 1)

        return opponents[index]
    }

    private getOpponentWithHighestMaxHp(opponents: FighterCombatEntity[]): FighterCombatEntity {
        return this.getByValue(opponents, fighter => fighter.getMaxHp(), 'max')
    }

    private getOpponentWithLowestMaxHp(opponents: FighterCombatEntity[]): FighterCombatEntity {
        return this.getByValue(opponents, fighter => fighter.getMaxHp(), 'min')
    }

    private getOpponentWithHighestCurrentHp(opponents: readonly FighterCombatEntity[]): FighterCombatEntity {
        return this.getByValue(opponents, fighter => fighter.getCurrentHp(), 'max')
    }

    private getOpponentWithLowestCurrentHp(opponents: FighterCombatEntity[]): FighterCombatEntity {
        return this.getByValue(opponents, fighter => fighter.getCurrentHp(), 'min')
    }

    private getByValue(
        opponents: readonly FighterCombatEntity[],
        selector: (
            fighter: FighterCombatEntity
        ) => number,
        mode: 'min' | 'max'
    ): FighterCombatEntity {
        const values = opponents.map(fighter => ({
            fighter,
            value: selector(fighter)
        }))

        const targetValue = mode === 'max'
            ? Math.max(...values.map(item => item.value))
            : Math.min(...values.map(item => item.value))

        const candidates = values.filter(item => item.value === targetValue)
            .map(item => item.fighter)

        return this.selectRandomOpponent(candidates)
    }

    private assertNever(value: never): never {
        throw new Error(`Unsupported enemy priority: ${value}`)
    }
}