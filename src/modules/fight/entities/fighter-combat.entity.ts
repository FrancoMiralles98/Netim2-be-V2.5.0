import { StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { FightCombatStatisticsTracker } from "../statistics/fight-combat-statistics.tracker";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";
import { FighterBaseStats } from "../types/fighter/fight-base-stats.type";
import { CreateFighterCombatProps, FighterCombatProps, SkillCooldownState } from "../types/fighter/fighter-combat.types";
import { ActiveAuraEntity } from "./active-aura.entity";
import { ActiveBuffEntity } from "./active-buff.entity";
import { ActiveStatusEffectEntity } from "./active-status-effect.entity";
import { SkillCooldownReductionResult } from "../types/fighter/cooldown.types";

export class FighterCombatEntity {
    private props: FighterCombatProps;
    constructor(createProps: CreateFighterCombatProps) {
        this.props = {
            id: createProps.id,
            name: createProps.name,

            targetType: createProps.targetType,
            weaponType: createProps.weaponType,

            baseStats: structuredClone(createProps.baseStats),
            effectiveStats: structuredClone(createProps.baseStats),

            resources: {
                hp: {
                    current: createProps.baseStats.general.maxHp,
                    max: createProps.baseStats.general.maxHp
                },
                mana: {
                    current: createProps.baseStats.general.maxMana,
                    max: createProps.baseStats.general.maxMana
                }
            },

            skills: createProps.skills,

            cooldowns: new Map(),
            activeEffects: new Map(),
            activeAuras: new Map(),
            activeBuffs: new Map(),
            statModifiers: new Map(),

            statistics: new FightCombatStatisticsTracker(),

            statsDirty: false,
            alive: true
        };
    }

    static create(props: CreateFighterCombatProps): FighterCombatEntity {
        return new FighterCombatEntity(props)
    }

    get id(): string {
        return this.props.id
    }

    get baseStats(): FighterBaseStats {
        return this.props.baseStats
    }

    get statistics(): FightCombatStatisticsTracker {
        return this.props.statistics;
    }

    markStatsDirty(): void {
        this.props.statsDirty = true;
    }

    needsStatsRecalculation(): boolean {
        return this.props.statsDirty;
    }

    getAllStatModifiers(): CombatStatModifier[] {
        return [
            ...this.getActiveAuras().flatMap(
                aura => aura.getStatModifiers()
            ),

            ...this.getActiveStatusEffects().flatMap(
                effect => effect.getStatModifiers()
            ),

            ...this.getActiveBuffs().flatMap(
                buff => buff.getStatModifiers()
            )
        ];
    }

    addStatModifiers(modifiers: readonly CombatStatModifier[]): void {
        if (modifiers.length === 0) {
            return;
        }

        for (const modifier of modifiers) {
            if (this.props.statModifiers.has(modifier.id)) {
                throw new Error(`Combat stat modifier ${modifier.id} is already active.`);
            }

            this.props.statModifiers.set(modifier.id, modifier);
        }

        this.markStatsDirty();
    }

    getStatModifiers(): readonly CombatStatModifier[] {
        return Array.from(this.props.statModifiers.values());
    }

    removeStatModifiersByAuraInstance(auraInstanceId: string): void {
        let removedAny = false;

        for (const [modifierId, modifier] of this.props.statModifiers) {
            if (
                modifier.source.type === 'aura' &&
                modifier.source.instanceId ===
                auraInstanceId
            ) {
                this.props.statModifiers.delete(modifierId);
                removedAny = true;
            }
        }

        if (removedAny) {
            this.markStatsDirty();
        }
    }

    updateEffectiveStats(stats: FighterBaseStats): void {
        this.props.effectiveStats = stats;
        this.props.statsDirty = false;
    }

    receiveDamage(amount: number) {
        const normalizedAmount = Math.max(0, Math.floor(amount))

        const hpBefore = this.props.resources.hp.current;

        const effectiveDamage = Math.min(hpBefore, normalizedAmount);
        const overkill = Math.max(0, normalizedAmount - hpBefore)

        this.props.resources.hp.current -= effectiveDamage;

        if (this.props.resources.hp.current === 0) {
            this.props.alive = false;
        }

        return {
            hpBefore,
            hpAfter: this.props.resources.hp.current,
            effectiveDamage,
            overkill,
            defeated: !this.props.alive
        };
    }

    heal(amount: number) {
        const normalizedAmount = Math.max(0, Math.floor(amount));

        const hpBefore = this.props.resources.hp.current;
        const missingHp = this.props.resources.hp.max - hpBefore;

        const effectiveHealing = Math.min(normalizedAmount, missingHp)

        const overhealing = Math.max(0, normalizedAmount - missingHp)

        this.props.resources.hp.current += effectiveHealing;

        return {
            hpBefore,
            hpAfter: this.props.resources.hp.current,
            effectiveHealing,
            overhealing
        };
    }

    isAlive(): boolean {
        return this.props.alive;
    }

    hasEnoughMana(amount: number): boolean {
        return this.props.resources.mana.current >= amount;
    }

    spendMana(amount: number) {
        const normalizedAmount = Math.max(0, Math.floor(amount));

        if (!this.hasEnoughMana(normalizedAmount)) {
            throw new Error(`Se quiere usar mana cuando no se tiene`);
        }

        const manaBefore = this.props.resources.mana.current;

        this.props.resources.mana.current -= normalizedAmount;

        return {
            manaBefore,
            manaAfter: this.props.resources.mana.current,
            amount: normalizedAmount
        };
    }

    restoreMana(amount: number) {
        const normalizedAmount = Math.max(0, Math.floor(amount));

        const manaBefore = this.props.resources.mana.current;
        const missingMana = this.props.resources.mana.max - manaBefore;

        const effectiveRestoration = Math.min(normalizedAmount, missingMana);

        const wastedRestoration = Math.max(0, normalizedAmount - missingMana);

        this.props.resources.mana.current += effectiveRestoration;

        return {
            manaBefore,
            manaAfter: this.props.resources.mana.current,
            effectiveRestoration,
            wastedRestoration
        };
    }

    addAura(aura: ActiveAuraEntity): void {
        if (this.props.activeAuras.has(aura.getInstanceId())) {
            throw new Error(
                `Aura instance ${aura.getInstanceId()} is already active`
            );
        }

        this.props.activeAuras.set(
            aura.getInstanceId(),
            aura
        );

        if (aura.hasStatModifiers()) {
            this.markStatsDirty();
        }
    }

    getActiveAuras(): readonly ActiveAuraEntity[] {
        return [...this.props.activeAuras.values()];
    }

    getActiveAuraBySkillId(id: UNIQUE_ID_SKILLS): ActiveAuraEntity {
        const activeAuras = [...this.props.activeAuras.values()];
        const aura = activeAuras.find(actieAura => actieAura.getSkillId() === id)
        if (!aura) {
            throw new Error('Active Aura not found')
        }
        return aura
    }

    hasActiveAuraBySkillId(id: UNIQUE_ID_SKILLS): boolean {
        const activeAuras = [...this.props.activeAuras.values()];
        return activeAuras.some(actieAura => actieAura.getSkillId() === id)
    }

    getActiveStatusEffects(): readonly ActiveStatusEffectEntity[] {
        return [...this.props.activeEffects.values()];
    }

    removeActiveStatusEffect(instanceId: string): ActiveStatusEffectEntity | undefined {
        const effect = this.props.activeEffects.get(instanceId);

        if (!effect) {
            return undefined;
        }

        this.props.activeEffects.delete(instanceId);

        return effect;
    }

    getActiveBuffs(): readonly ActiveBuffEntity[] {
        return [...this.props.activeBuffs.values()];
    }

    findActiveStatusEffect(effectId: StatusEffectsKeys): ActiveStatusEffectEntity | undefined {
        return this.getActiveStatusEffects().find(
            effect => effect.getEffectId() === effectId && effect.isActive());
    }

    startSkillCooldown(skillId: UNIQUE_ID_SKILLS, turns: number): SkillCooldownState {
        const normalizedTurns = Math.max(0, Math.floor(turns));

        if (normalizedTurns === 0) {
            this.props.cooldowns.delete(skillId);

            return {
                initialTurns: 0,
                remainingTurns: 0
            };
        }

        const cooldown: SkillCooldownState = {
            initialTurns: normalizedTurns,
            remainingTurns: normalizedTurns
        };

        this.props.cooldowns.set(skillId, cooldown);

        return { ...cooldown };
    }

    getRegenerationValues(): { hp: number, mana: number } {
        return {
            hp: this.props.effectiveStats.general.regenHp,
            mana: this.props.effectiveStats.general.regenMana
        }
    }

    isSkillOnCooldown(skillId: UNIQUE_ID_SKILLS): boolean {
        return (this.props.cooldowns.get(skillId)?.remainingTurns ?? 0) > 0;
    }

    getSkillCooldown(skillId: UNIQUE_ID_SKILLS): Readonly<SkillCooldownState> | undefined {
        const cooldown =
            this.props.cooldowns.get(skillId);

        return cooldown ? { ...cooldown } : undefined;
    }

    getSkillRemainingCooldown(skillId: UNIQUE_ID_SKILLS): number {
        return (this.props.cooldowns.get(skillId)?.remainingTurns ?? 0);
    }

    reduceSkillCooldowns(): SkillCooldownReductionResult[] {
        const results: SkillCooldownReductionResult[] = [];

        for (const [skillId, cooldown] of this.props.cooldowns) {
            const previousTurns = cooldown.remainingTurns;

            const remainingTurns = Math.max(0, previousTurns - 1);

            results.push({
                skillId,
                initialTurns: cooldown.initialTurns,
                previousTurns,
                remainingTurns,
                finished: remainingTurns === 0
            });

            if (remainingTurns === 0) {
                this.props.cooldowns.delete(skillId);
                continue;
            }

            /*
             * Se conserva initialTurns y solamente
             * se actualiza remainingTurns.
             */
            cooldown.remainingTurns = remainingTurns;
        }

        return results;
    }


}