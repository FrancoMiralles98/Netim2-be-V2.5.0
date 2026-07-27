import { DurationConfig } from "netim2-shared";

export class ActiveDurationEntity {
    private constructor(
        private readonly type: 'turns' | 'until_no_mana',
        private readonly initialTurns?: number,
        private remainingTurns?: number
    ) { }

    static create(config: DurationConfig): ActiveDurationEntity {
        switch (config.type) {
            case 'turns':
                return new ActiveDurationEntity('turns', config.turns, config.turns);
            case 'until_no_mana':
                return new ActiveDurationEntity('until_no_mana');
        }
    }

    advanceTurn() {
        if (this.type !== 'turns') {
            return { expired: false };
        }

        const previousTurns = this.remainingTurns ?? 0;

        this.remainingTurns = Math.max(0, previousTurns - 1);

        return {
            previousTurns,
            remainingTurns: this.remainingTurns,
            expired: this.remainingTurns === 0
        };
    }

    isExpired(): boolean {
        return (this.type === 'turns' && this.remainingTurns === 0);
    }

    getRemainingTurns(): number | undefined {
        return this.remainingTurns;
    }

}