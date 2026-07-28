import { CreateFightProps, FighterInitiativeResult, FightIdentity, FightPhase, FightResult, FightRuntimeState, FightStatus } from "../types/fight/fight.type";
import { FighterCombatEntity } from "./fighter-combat.entity";

export class FightEntity {
    private readonly identity: FightIdentity;
    private readonly state: FightRuntimeState;

    constructor(props: CreateFightProps) {
        this.validateFighters(props.fighters);

        this.identity = {
            id: props.id,
            randomSeed: props.randomSeed,
            maxTurns: props.maxTurns ?? 500
        };

        this.state = {
            status: 'pending',
            phase: 'setup',

            fighters: new Map(
                props.fighters.map(fighter => [fighter.id, fighter])
            ),

            initiativeResults: [],
            turnOrder: [],
            aliveFighters: props.fighters.map(fighter => fighter.id),
            defeatedFighters: [],
            currentTurnIndex: -1,
            currentActorId: undefined,

            turnNumber: 0,

            result: undefined
        };
    }

    get id(): string {
        return this.identity.id;
    }

    get randomSeed(): string {
        return this.identity.randomSeed;
    }

    get maxTurns(): number {
        return this.identity.maxTurns;
    }

    get status(): FightStatus {
        return this.state.status;
    }

    get phase(): FightPhase {
        return this.state.phase;
    }

    get turnNumber(): number {
        return this.state.turnNumber;
    }

    get result(): FightResult | undefined {
        return this.state.result;
    }

    get isFinished(): boolean {
        return this.state.status === 'finished';
    }

    get isInProgress(): boolean {
        return this.state.status === 'in_progress';
    }

    setPhase(phase: FightPhase): void {
        this.ensureFightInProgress();

        if (phase === 'setup' || phase === 'finished') {
            throw new Error(`Cannot manually change the fight phase to ${phase}.`);
        }

        if (!this.state.currentActorId) {
            throw new Error('A turn must be active before changing its phase.');
        }
        this.state.phase = phase;
    }

    getFighter(fighterId: string): FighterCombatEntity {
        const fighter = this.state.fighters.get(fighterId);

        if (!fighter) {
            throw new Error(`Fighter ${fighterId} does not belong to fight ${this.id}.`);
        }

        return fighter;
    }

    getFighters(): readonly FighterCombatEntity[] {
        return [...this.state.fighters.values()];
    }

    getAliveFighters(): FighterCombatEntity[] {
        return this.getFighters().filter(fighter => fighter.isAlive);
    }

    getDefeatedFighters(): FighterCombatEntity[] {
        return this.getFighters().filter(fighter => !fighter.isAlive);
    }

    setInitiative(results: FighterInitiativeResult[]): void {
        if (this.state.status !== 'pending') {
            throw new Error('Initiative can only be set before the fight starts.');
        }

        this.validateInitiativeResults(results);

        const orderedResults = [...results].sort(
            (fighterA, fighterB) => {
                if (fighterB.total !== fighterA.total) {
                    return fighterB.total - fighterA.total;
                }

                return ((fighterB.tieBreakerRoll ?? 0) - (fighterA.tieBreakerRoll ?? 0));
            }
        );

        this.state.initiativeResults = orderedResults;

        this.state.turnOrder = orderedResults.map(result => result.fighterId);
    }

    getSingleOpponentOf(fighterId: string): FighterCombatEntity {
        const fightersIds = this.getAliveOpponentsIdsOf(fighterId)
        if (fightersIds.length < 1) {
            throw new Error(`Expected exactly one alive opponent for fighter ${fighterId}.`);
        }
        return this.getFighter(fightersIds[0])
    }

    private getAliveOpponentsIdsOf(fighterId: string): string[] {
        return this.state.aliveFighters.filter(ids => ids !== fighterId)
    }

    start(): void {
        if (this.state.status !== 'pending') {
            throw new Error('The fight has already started.');
        }

        if (this.state.turnOrder.length === 0) {
            throw new Error('Initiative must be resolved before starting the fight.');
        }

        this.state.status = 'in_progress';
        this.state.phase = 'between_turns';
    }

    beginNextTurn() {
        this.ensureFightInProgress();

        const result = this.tryFinish();

        if (result) {
            throw new Error('Cannot begin a new turn because the fight has finished.');
        }

        const nextIndex = this.findNextAliveFighterIndex(this.state.currentTurnIndex);

        this.state.currentTurnIndex = nextIndex;

        this.state.currentActorId = this.state.turnOrder[nextIndex];

        this.state.turnNumber += 1;
        this.state.phase = 'turn_start';

        return {
            turnNumber: this.state.turnNumber,
            actorId: this.state.currentActorId,
            phase: this.state.phase
        };
    }

    getCurrentActor(): FighterCombatEntity {
        this.ensureFightInProgress();

        const actorId = this.state.currentActorId;

        if (!actorId) {
            throw new Error('There is no active turn.');
        }

        return this.getFighter(actorId);
    }

    completeCurrentTurn(): FightResult | undefined {
        this.ensureFightInProgress();

        if (!this.state.currentActorId) {
            throw new Error('There is no active turn to complete.');
        }

        this.state.phase = 'turn_end';

        const result = this.tryFinish();

        if (result) {
            return result;
        }

        this.state.currentActorId = undefined;
        this.state.phase = 'between_turns';

        return undefined;
    }

    tryFinish(): FightResult | undefined {
        if (this.state.status === 'finished') {
            return this.state.result;
        }

        const aliveFighters = this.getAliveFighters();

        if (aliveFighters.length === 1) {
            return this.finish({
                outcome: 'winner',

                winnerFighterId:
                    aliveFighters[0].id,

                defeatedFighterIds:
                    this.getDefeatedFighters().map(fighter => fighter.id),

                survivingFighterIds:
                    aliveFighters.map(fighter => fighter.id),

                reason: 'fighter_defeated',

                finishedOnTurn: this.state.turnNumber
            });
        }

        if (aliveFighters.length === 0) {
            return this.finish({
                outcome: 'draw',

                defeatedFighterIds:
                    this.getDefeatedFighters().map(fighter => fighter.id),

                survivingFighterIds: [],

                reason: 'simultaneous_defeat',

                finishedOnTurn: this.state.turnNumber
            });
        }

        if (this.state.turnNumber >= this.identity.maxTurns) {
            return this.finish({
                outcome: 'draw',

                defeatedFighterIds:
                    this.getDefeatedFighters().map(fighter => fighter.id),

                survivingFighterIds: aliveFighters.map(fighter => fighter.id),

                reason: 'max_turns_reached',

                finishedOnTurn: this.state.turnNumber
            });
        }

        return undefined;
    }

    private finish(result: FightResult): FightResult {
        if (this.state.status === 'finished') {
            throw new Error('The fight is already finished.');
        }

        this.state.status = 'finished';
        this.state.phase = 'finished';

        this.state.currentActorId = undefined;
        this.state.result = result;

        return result;
    }

    private findNextAliveFighterIndex(currentIndex: number): number {
        const totalFighters = this.state.turnOrder.length;

        for (let offset = 1; offset <= totalFighters; offset += 1) {
            const nextIndex = (currentIndex + offset) % totalFighters;

            const fighterId = this.state.turnOrder[nextIndex];

            const fighter = this.getFighter(fighterId);

            if (fighter.isAlive()) {
                return nextIndex;
            }
        }

        throw new Error('There are no alive fighters available for the next turn.');
    }

    private ensureFightInProgress(): void {
        if (this.state.status !== 'in_progress') {
            throw new Error(`Fight ${this.id} is not in progress.`);
        }
    }

    private validateInitiativeResults(results: FighterInitiativeResult[]): void {
        const fighterIds = new Set(this.getFighters().map(fighter => fighter.id));

        if (results.length !== fighterIds.size) {
            throw new Error('Every fighter must have an initiative result.');
        }

        const resultIds = results.map(result => result.fighterId);

        const uniqueResultIds = new Set(resultIds);

        if (uniqueResultIds.size !== resultIds.length) {
            throw new Error('A fighter cannot have multiple initiative results.');
        }

        for (const fighterId of resultIds) {
            if (!fighterIds.has(fighterId)) {
                throw new Error(`Fighter ${fighterId} does not belong to the fight.`);
            }
        }
    }

    private validateFighters(fighters: FighterCombatEntity[]): void {
        if (fighters.length < 2) {
            throw new Error('A fight requires at least two fighters.');
        }

        const fighterIds = fighters.map(fighter => fighter.id);

        const uniqueIds = new Set(fighterIds);

        if (uniqueIds.size !== fighterIds.length) {
            throw new Error('A fight cannot contain duplicated fighter IDs.');
        }
    }
}