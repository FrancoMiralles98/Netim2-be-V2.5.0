import { DurationConfig } from "netim2-shared";
import { ActiveDurationAdvanceResult } from "../types/activeDuration/activeDuration.types";

export class ActiveDurationEntity {
    private constructor(
        private readonly type: DurationConfig['type'],
        private readonly initialTurns?: number,
        private remainingTurns?: number
    ) { }

    static create(
        config: DurationConfig
    ): ActiveDurationEntity {
        switch (config.type) {
            case 'turns': {
                if (!Number.isInteger(config.turns) || config.turns <= 0) {
                    throw new Error('Duration turns must be a positive integer.');
                }

                return new ActiveDurationEntity('turns', config.turns, config.turns);
            }
            case 'until_no_mana':
                return new ActiveDurationEntity('until_no_mana');
        }
    }

    advanceTurn(): ActiveDurationAdvanceResult {
        if (this.type === 'until_no_mana') {
            return {
                type: 'until_no_mana',
                expired: false
            };
        }

        const previousTurns = this.remainingTurns ?? 0;

        this.remainingTurns = Math.max(0, previousTurns - 1);

        return {
            type: 'turns',
            previousTurns,
            remainingTurns: this.remainingTurns,
            expired: this.remainingTurns === 0
        };
    }

    isExpired(): boolean {
        return ( this.type === 'turns' && this.remainingTurns === 0);
    }

    hasLimitedDuration(): boolean {
        return this.type === 'turns';
    }

    isUntilNoMana(): boolean {
        return this.type === 'until_no_mana';
    }

    getType(): DurationConfig['type'] {
        return this.type;
    }

    getInitialTurns(): number | undefined {
        return this.initialTurns;
    }

    getRemainingTurns(): number | undefined {
        return this.remainingTurns;
    }

}