import { DamageType, UNIQUE_ID_SKILLS } from "netim2-shared";
import { DamageDealStatistics } from "../types/statistics/damage-statistics.types";
import { FighterCombatStatisticsState } from "../types/statistics/fighter-combat-statistics.type";
import { RegisterAttackHitsInput, RegisterDamageDealtInput, RegisterDamageMitigatedInput, RegisterDefensiveHitInput, RegisteredDamageSource, RegisterEffectsInput, RegisterHealingInput, RegisterOffensiveHitInput, RegisterResourceInput } from "../types/statistics/statistics-inputs.types";
import { createEmptyFighterCombatStatisticsState } from "../utils/create-empty-fight-statistics";

export class FightCombatStatisticsTracker {
    private readonly state: FighterCombatStatisticsState;

    constructor() {
        this.state = createEmptyFighterCombatStatisticsState();
    }

    get snapshot(): FighterCombatStatisticsState {
        return structuredClone(this.state);
    }

    /**
     * Registra el daño efectivo causado por el combatiente.
     *
     * El mismo daño se clasifica simultáneamente por:
     * - tipo de daño;
     * - forma de aplicación;
     * - origen;
     * - skill o efecto de estado, cuando corresponda.
     *
     * Esto no duplica el total. Las ramas son clasificaciones
     * diferentes del mismo daño.
     */
    registerDamageDealt(input: RegisterDamageDealtInput): void {
        const amount = this.normalizeAmount(input.amount);

        if (amount === 0) {
            return;
        }

        const statistics = this.state.damage.dealt;

        statistics.total += amount;
        statistics.byDelivery[input.delivery] += amount;

        if (input.delivery === 'periodic') {
            if (input.source.type !== 'status_effect') {
                throw new Error(
                    'Periodic damage must come from a status effect.'
                );
            }

            statistics.bySource.statusEffects += amount;

            this.incrementPartialRecord(
                statistics.byStatusEffect,
                input.source.effectId,
                amount
            );

            return;
        }

        statistics.byDamageType[input.damageType] += amount;

        this.registerDamageSource(
            statistics,
            input.source,
            input.damageType,
            amount
        );
    }

    /**
     * Registra el daño evitado por el combatiente.
     */
    registerDamageMitigated(input: RegisterDamageMitigatedInput): void {
        const amount = this.normalizeAmount(input.amount);

        if (amount === 0) {
            return;
        }

        const statistics = this.state.damage.mitigated;

        statistics.total += amount;
        statistics.byDamageType[input.damageType] += amount;

        if (input.statusEffectId !== undefined) {
            this.incrementPartialRecord(statistics.byStatusEffect, input.statusEffectId, amount);
        }
    }

    /**
     * registro de estadisticas de los ataques basicos
     */
    registerAttackHits(input: RegisterAttackHitsInput): void {
        if (input.doubleHitTriggered) {
            this.state.hits.doubleHitsTriggered += 1;
        }

        for (const hit of input.hits) {
            this.registerOffensiveHit(hit);
        }
    }



    /**
     * 
    * registrar estadisticas defensivas de los ataques basicos
     */
    registerDefensiveHit(input: RegisterDefensiveHitInput): void {
        switch (input.result) {
            case 'received':
                return;

            case 'dodged':
                this.state.hits.dodged += 1;
                return;

            case 'blocked':
                this.state.hits.blocked += 1;
                return;
        }
    }

    registerHealing(input: RegisterHealingInput): void {
        switch (input.type) {
            case 'basic_attack':
                this.state.healing.byBasicAttack += this.normalizeAmount(input.amount ?? 0);
                break;
            case 'prevented':
                this.state.healing.prevented += this.normalizeAmount(input.amount ?? 0);
                break;
            case 'regeneration':
                this.state.healing.hpRegenerated += this.normalizeAmount(input.amount ?? 0);
                break;
            case 'skill':{
                const findSkill = this.state.healing.bySkill.find(skill=>skill.idSkill === input.idSkill )
                if (findSkill) {
                    findSkill.amount += input.amount
                } else {
                    this.state.healing.bySkill.push({
                        amount: input.amount,
                        idSkill: input.idSkill
                    })
                }
            }
                break;
            default:
                break;
        }
    }

    registerResources(input: RegisterResourceInput): void {
        this.state.resources.manaSpent += this.normalizeAmount(input.manaSpent ?? 0);

        this.state.resources.manaRegenerated += this.normalizeAmount(input.manaRegenerated ?? 0);

        this.state.resources.manaRestored += this.normalizeAmount(input.manaRestored ?? 0);

        this.state.resources.manaDrained += this.normalizeAmount(input.manaDrained ?? 0);
    }

    registerTurnPlayed(): void {
        this.state.actions.turnsPlayed += 1;
    }

    registerBasicAttackUsed(): void {
        this.state.actions.basicAttacksUsed += 1;
    }

    registerSkillUsed(): void {
        this.state.actions.skillsUsed += 1;
    }

    registerSkippedTurn(): void {
        this.state.actions.skippedTurns += 1;
    }

    registerSkippedTurnByStun(): void {
        this.state.actions.skippedTurns += 1;
        this.state.actions.skippedByStun += 1;
    }

    registerEffects(input: RegisterEffectsInput): void {
        this.incrementPartialRecordMap(
            this.state.effects.appliedByType,
            input.appliedByType
        );

        this.incrementPartialRecordMap(
            this.state.effects.receivedByType,
            input.receivedByType
        );

        this.incrementPartialRecordMap(
            this.state.effects.resistedByType,
            input.resistedByType
        );
    }

    /**
     * Devuelve una copia del estado acumulado.
     *
     * De esta forma, quien consume las estadísticas no puede
     * modificar el estado interno del tracker.
     */
    toSnapshot(): FighterCombatStatisticsState {
        return structuredClone(this.state);
    }

    private registerDamageSource(
        statistics: DamageDealStatistics,
        source: RegisteredDamageSource,
        damageType: DamageType,
        amount: number
    ): void {
        switch (source.type) {
            case 'basic_attack': {
                statistics.bySource.basicAttack += amount;
                return;
            }

            case 'skill': {
                statistics.bySource.skills += amount;

                this.registerSkillDamage(
                    statistics,
                    source.skillId,
                    damageType,
                    amount
                );

                return;
            }

            /*
             * Normalmente no debería llegar acá, porque los daños
             * de efectos de estado son periódicos y retornan antes.
             *
             * Se conserva por si en el futuro existe un efecto de
             * estado que cause daño directo.
             */
            case 'status_effect': {
                statistics.bySource.statusEffects += amount;

                this.incrementPartialRecord(
                    statistics.byStatusEffect,
                    source.effectId,
                    amount
                );

                return;
            }

            case 'reflected': {
                statistics.bySource.reflected += amount;
                return;
            }
        }
    }

    private registerSkillDamage(
        statistics: DamageDealStatistics,
        skillId: UNIQUE_ID_SKILLS,
        damageType: DamageType,
        amount: number
    ): void {
        const skillStatistics = statistics.bySkill[skillId];

        if (!skillStatistics) {
            statistics.bySkill[skillId] = { total: amount, damageType };
            return;
        }

        if (skillStatistics.damageType !== damageType) {
            throw new Error(
                `Skill ${skillId} already registered damage as ` +
                `${skillStatistics.damageType}, but received ${damageType}.`
            );
        }

        skillStatistics.total += amount;
    }

    private incrementPartialRecordMap<TKey extends string>(
        target: Partial<Record<TKey, number>>,
        source?: Partial<Record<TKey, number>>
    ): void {
        if (!source) {
            return;
        }

        const keys = Object.keys(source) as TKey[];

        for (const key of keys) {
            const value = source[key];

            if (value === undefined) {
                continue;
            }

            const amount = this.normalizeAmount(value);

            if (amount === 0) {
                continue;
            }

            target[key] = (target[key] ?? 0) + amount;
        }
    }

    private incrementPartialRecord<TKey extends PropertyKey>(
        record: Partial<Record<TKey, number>>,
        key: TKey,
        amount: number
    ): void {
        record[key] = (record[key] ?? 0) + amount;
    }

    private registerOffensiveHit(input: RegisterOffensiveHitInput): void {
        this.state.hits.attempted += 1;

        if (input.result !== 'successful') {
            this.state.hits.missed += 1;
            return;
        }

        this.state.hits.successful += 1;

        if (input.critical) {
            this.state.hits.critical += 1;
        }

        if (input.penetrating) {
            this.state.hits.penetrating += 1;
        }
    }

    private normalizeAmount(amount: number): number {
        if (!Number.isFinite(amount)) {
            throw new Error('Combat statistic amount must be a finite number.');
        }

        return Math.max(0, Math.floor(amount));
    }


}