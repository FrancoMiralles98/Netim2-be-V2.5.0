import { AllTargetType, BonusRefKeys, CharacterRace, SkillAura, SkillBuff, SkillDamage, SkillHeal, SkillType, StatusEffectsKeys, TypeWeapon, UNIQUE_ID_SKILLS } from "netim2-shared";
import { FightCombatStatisticsTracker } from "../statistics/fight-combat-statistics.tracker";
import { CombatStatKey, CombatStatModifier } from "../types/activeAura/active-aura.type";
import { FighterBaseStats } from "../types/fighter/fight-base-stats.type";
import { CreateFighterCombatProps, FighterCombatProps, FighterResources, RestoreManaResult, SkillCooldownState } from "../types/fighter/fighter-combat.types";
import { ActiveAuraEntity } from "./active-aura.entity";
import { ActiveBuffEntity } from "./active-buff.entity";
import { ActiveStatusEffectEntity } from "./active-status-effect.entity";
import { SkillCooldownReductionResult } from "../types/fighter/cooldown.types";
import { HealingReductionResult, HealingReductionSource } from "../types/fighter/healing-reduction.types";
import { FightConfig } from "netim2-shared/dist/character/character-fight-config.type";
import { ActiveStatusEffectId } from "../types/statusEffects/active-status-effect.types";
import { CD_REDUCTION_PER_VH } from "src/modules/shared/config/character-stats.config";
import { COMBAT_STAT_TO_BONUS_REF, LIMIT_BONUS_CONFIG } from "src/modules/bonus/config/limit-bonus.config";

export class FighterCombatEntity {
    private props: FighterCombatProps;
    constructor(createProps: CreateFighterCombatProps) {
        this.props = {
            id: createProps.id,
            name: createProps.name,
            race: createProps.race,
            targetType: createProps.targetType,
            weaponType: createProps.weaponType,
            fightConfig: createProps.fightConfig,

            baseStats: structuredClone(createProps.baseStats),
            effectiveStats: structuredClone(createProps.baseStats),

            resources: {
                hp: {
                    current: createProps.baseStats.general.hp.actual,
                    max: createProps.baseStats.general.hp.max
                },
                mana: {
                    current: createProps.baseStats.general.mana.actual,
                    max: createProps.baseStats.general.mana.max
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


    get fightConfig(): FightConfig {
        return this.props.fightConfig
    }

    get id(): string {
        return this.props.id
    }

    get weaponType(): TypeWeapon | undefined {
        return this.props.weaponType
    }

    get baseStats(): FighterBaseStats {
        return this.props.baseStats
    }

    getFocusedEnemyId(): string | undefined {
        return this.props.enemieFocus
    }

    get resources(): FighterResources {
        return this.props.resources
    }

    get statistics(): FightCombatStatisticsTracker {
        return this.props.statistics;
    }

    get targetType(): AllTargetType {
        return this.props.targetType;
    }

    get race(): CharacterRace | undefined {
        return this.props.race;
    }

    get name(): string {
        return this.props.name;
    }

    getCurrentHp(): number {
        return this.props.resources.hp.current
    }

    getCurrentMana(): number {
        return this.props.resources.mana.current
    }

    setFocusedEnemyId(targetId: string) {
        this.props.enemieFocus = targetId
    }

    clearFocusedEnemy() {
        this.props.enemieFocus = undefined
    }

    getMaxHp(): number {
        return this.props.effectiveStats.general.hp.max
    }

    markStatsDirty(): void {
        this.props.statsDirty = true;
    }

    getSkillsAura(): SkillAura[] {
        return this.props.skills.filter((skill) => skill.type === 'aura');
    }

    getSkillsBuff(): SkillBuff[] {
        return this.props.skills.filter((skill) => skill.type === 'buff');
    }

    getSkillsDamage(): SkillDamage[] {
        return this.props.skills.filter((skill) => skill.type === 'damage');
    }

    getSkillsHeal(): SkillHeal[] {
        return this.props.skills.filter((skill) => skill.type === 'heal');
    }

    getSkillById(id: UNIQUE_ID_SKILLS): SkillType {
        const skill = this.props.skills.find((skill) => skill.id === id);
        if (!skill) {
            throw new Error('Skill not found')
        }
        return skill
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

    getHealingReduction(): HealingReductionResult {
        const sources: HealingReductionSource[] = [];

        for (const effect of this.props.activeEffects.values()) {
            if (!effect.isActive()) {
                continue;
            }

            const data = effect.Effectdata;

            switch (data.effectId) {
                case 'veneno':
                    sources.push({
                        effectId: 'veneno',
                        sourceFighterId: effect.getSourceFighterId(),
                        effectInstanceId: effect.getInstanceId(),
                        reductionPercent: data.healReductionPorcent
                    });
                    break;
                case 'corta_curacion':
                    sources.push({
                        effectId: 'corta_curacion',
                        sourceFighterId: effect.getSourceFighterId(),
                        effectInstanceId: effect.getInstanceId(),
                        reductionPercent: data.healReductionPorcent
                    });
                    break;
            }
        }

        const totalReductionPercent = Math.min(100, sources.reduce((total, source) =>
            total + source.reductionPercent, 0));

        return {
            totalReductionPercent,
            sources
        };
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

    get effectiveStats(): Readonly<FighterBaseStats> {
        this.ensureEffectiveStatsUpdated();

        return this.props.effectiveStats;
    }

    receiveDamage(amount: number) {
        const normalizedAmount = Math.max(0, Math.floor(amount))

        const hpBefore = this.props.resources.hp.current;

        const effectiveDamage = Math.min(hpBefore, normalizedAmount);
        const overkill = Math.max(0, normalizedAmount - hpBefore)

        this.props.resources.hp.current -= effectiveDamage;

        if (this.props.resources.hp.current <= 0) {
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
        return this.props.alive
    }

    hasEnoughMana(amount: number): boolean {
        return this.props.resources.mana.current >= amount
    }

    spendMana(amount: number) {
        const flatReduction = this.getEffectiveStatValue('bonus.defensa.mana_cost')
        const porcentualReduction = this.getEffectiveStatValue('bonus.defensa.porcentage_mana_cost')

        const amountAfterFlatReduction = amount + flatReduction
        const amountAfterPorcentualReduction = amountAfterFlatReduction * (1 - porcentualReduction / 100)

        const normalizedAmount = Math.max(0, Math.floor(amountAfterPorcentualReduction))

        if (!this.hasEnoughMana(normalizedAmount)) {
            throw new Error(`Se quiere usar mana cuando no se tiene`)
        }

        const manaBefore = this.props.resources.mana.current

        this.props.resources.mana.current -= normalizedAmount

        return {
            manaBefore,
            manaAfter: this.props.resources.mana.current,
            amount: normalizedAmount
        };
    }

    restoreMana(amount: number): RestoreManaResult {
        const normalizedAmount = Math.max(0, Math.floor(amount))

        const manaBefore = this.props.resources.mana.current
        const missingMana = this.props.resources.mana.max - manaBefore

        const effectiveRestoration = Math.min(normalizedAmount, missingMana)

        const wastedRestoration = Math.max(0, normalizedAmount - missingMana)

        this.props.resources.mana.current += effectiveRestoration

        return {
            manaBefore,
            manaAfter: this.props.resources.mana.current,
            effectiveRestoration,
            wastedRestoration
        };
    }

    addAura(aura: ActiveAuraEntity): void {
        if (this.props.activeAuras.has(aura.getInstanceId())) {
            throw new Error(`Aura instance ${aura.getInstanceId()} is already active`);
        }

        this.props.activeAuras.set(aura.getInstanceId(), aura)

        if (aura.hasStatModifiers()) {
            this.markStatsDirty()
        }
    }

    addBuff(buff: ActiveBuffEntity): void {
        if (this.props.activeBuffs.has(buff.getInstanceId())) {
            throw new Error(`Buff instance ${buff.getInstanceId()} is already active`)
        }

        this.props.activeBuffs.set(buff.getInstanceId(), buff)

        if (buff.hasStatModifiers()) {
            this.markStatsDirty()
        }
    }

    getActiveAuras(): readonly ActiveAuraEntity[] {
        return [...this.props.activeAuras.values()];
    }

    getHpPercentage(): number {
        const { current, max } = this.props.resources.hp

        if (max <= 0) {
            return 0
        }

        return current * 100 / max
    }

    getActiveAuraBySkillId(id: UNIQUE_ID_SKILLS): ActiveAuraEntity {
        const activeAuras = [...this.props.activeAuras.values()]
        const aura = activeAuras.find(actieAura => actieAura.getSkillId() === id)
        if (!aura) {
            throw new Error('Active Aura not found')
        }
        return aura
    }

    hasActiveAuraBySkillId(id: UNIQUE_ID_SKILLS): boolean {
        const activeAuras = [...this.props.activeAuras.values()]
        return activeAuras.some(actieAura => actieAura.getSkillId() === id && actieAura.isActive())
    }

    hasActiveBuffBySkillId(id: UNIQUE_ID_SKILLS): boolean {
        const activeAuras = [...this.props.activeBuffs.values()]
        return activeAuras.some(activeBuff => activeBuff.getSkillId() === id && activeBuff.isActive())
    }

    getActiveStatusEffects(): readonly ActiveStatusEffectEntity[] {
        return [...this.props.activeEffects.values()]
    }

    getActiveStatusEffectByEffectId(effectId: ActiveStatusEffectId): ActiveStatusEffectEntity | undefined {
        for (const effect of this.props.activeEffects.values()) {
            if (effect.isActive() && effect.getEffectId() === effectId) {
                return effect;
            }
        }
        return undefined;
    }

    addActiveStatusEffect(effect: ActiveStatusEffectEntity): void {
        this.props.activeEffects.set(effect.getInstanceId(), effect)
    }

    hasActiveStatusEffect(statusEffectId: StatusEffectsKeys): boolean {
        const activeEffects = [...this.props.activeEffects.values()]
        return activeEffects.some(effect =>
            effect.getEffectId() === statusEffectId &&
            effect.isActive()
        )
    }

    removeActiveStatusEffectByIstanceId(instanceId: string): ActiveStatusEffectEntity | undefined {
        const effect = this.props.activeEffects.get(instanceId)

        if (!effect) {
            return undefined
        }

        this.props.activeEffects.delete(instanceId)

        return effect
    }

    removeStatModifiersByStatusEffectInstance(instanceId: string): void {
        let removed = false

        for (const [modifierId, modifier] of this.props.statModifiers) {
            if (modifier.source.type === 'status_effect' && modifier.source.instanceId === instanceId) {
                this.props.statModifiers.delete(modifierId)
                removed = true
            }
        }

        if (removed) {
            this.markStatsDirty();
        }
    }

    removeActiveBuff(instanceId: string): ActiveBuffEntity | undefined {
        const buff = this.props.activeBuffs.get(instanceId)

        if (!buff) {
            return undefined
        }

        this.props.activeBuffs.delete(instanceId)

        return buff
    }

    removeActiveAura(instanceId: string): ActiveAuraEntity | undefined {
        const aura = this.props.activeAuras.get(instanceId)

        if (!aura) {
            return undefined
        }

        this.props.activeAuras.delete(instanceId)

        return aura
    }

    getActiveBuffs(): readonly ActiveBuffEntity[] {
        return [...this.props.activeBuffs.values()];
    }

    getActiveBuffBySkillId(
        skillId: UNIQUE_ID_SKILLS
    ): ActiveBuffEntity | undefined {
        for (const buff of this.props.activeBuffs.values()) {
            if (buff.isActive() && buff.getSkillId() === skillId) {
                return buff;
            }
        }
        return undefined
    }

    findActiveStatusEffect(effectId: StatusEffectsKeys): ActiveStatusEffectEntity | undefined {
        return this.getActiveStatusEffects().find(
            effect => effect.getEffectId() === effectId && effect.isActive());
    }

    startSkillCooldown(skillId: UNIQUE_ID_SKILLS, turns: number): SkillCooldownState {
        const normalizedTurns = Math.max(0, Math.floor(turns));

        const vh = this.effectiveStats.general.vh;

        const cooldownReduction = vh * CD_REDUCTION_PER_VH;

        const cooldownMultiplier = 1 - (cooldownReduction / 100);

        const finalTurns = Math.max(0, Math.ceil(turns * cooldownMultiplier));

        if (normalizedTurns === 0) {
            this.props.cooldowns.delete(skillId);

            return {
                initialTurns: 0,
                remainingTurns: 0
            };
        }

        const cooldown: SkillCooldownState = {
            initialTurns: finalTurns,
            remainingTurns: finalTurns
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

    getBaseStatValue(target: CombatStatKey): number {
        return this.getNumericStatByPath(this.baseStats, target);
    }

    getEffectiveStatValue(target: CombatStatKey): number {
        return this.getNumericStatByPath(this.effectiveStats, target);
    }

    private getNumericStatByPath(stats: FighterBaseStats, path: CombatStatKey): number {
        const segments = path.split('.');

        let current: unknown = stats;

        for (const segment of segments) {
            if (
                current === null ||
                typeof current !== 'object' ||
                !(segment in current)
            ) {
                throw new Error(`No se encontró la estadística ${path}.`);
            }

            current = (current as Record<string, unknown>)[segment];
        }

        if (typeof current !== 'number' || !Number.isFinite(current)) {
            throw new Error(`La estadística ${path} no contiene un valor numérico válido.`);
        }

        return current;
    }

    /**
 * Garantiza que las estadísticas efectivas estén actualizadas
 * antes de ser utilizadas.
 */
    private ensureEffectiveStatsUpdated(): void {
        if (!this.props.statsDirty) {
            return;
        }

        this.recalculateEffectiveStats();
    }

    /**
 * Reconstruye todas las estadísticas efectivas a partir de las
 * estadísticas base y de los modificadores actualmente activos.
 *
 * Los modificadores flat se aplican primero y los porcentuales
 * se acumulan entre sí antes de aplicarse.
 */
    private recalculateEffectiveStats(): void {
        console.log('antes', this.name, this.props.effectiveStats.general.va);

        const effectiveStats = structuredClone(this.props.baseStats);

        const modifiersByStat = this.groupStatModifiersByTarget();

        for (const [target, modifiers] of modifiersByStat) {
            const baseValue = this.getBaseStatValue(target);

            const effectiveValue = this.calculateEffectiveStat(target, baseValue, modifiers);

            this.setNumericStatByPath(effectiveStats, target, effectiveValue);
        }

        this.props.effectiveStats = effectiveStats;

        this.props.statsDirty = false;

        console.log('despues', this.name, this.props.effectiveStats.general.va);
    }

    /**
 * Agrupa los modificadores activos según la estadística
 * sobre la que actúan.
 */
    private groupStatModifiersByTarget(): Map<CombatStatKey, CombatStatModifier[]> {

        const grouped = new Map<CombatStatKey, CombatStatModifier[]>();

        for (const modifier of this.props.statModifiers.values()) {
            const modifiers = grouped.get(modifier.target);

            if (modifiers) {
                modifiers.push(modifier);
                continue;
            }

            grouped.set(modifier.target, [modifier]);
        }

        return grouped;
    }


    /**
 * Calcula el valor efectivo de una estadística.
 *
 * Orden:
 *
 * 1. Se suman/restan todos los modificadores flat.
 * 2. Se acumulan los aumentos porcentuales.
 * 3. Se acumulan las reducciones porcentuales.
 * 4. Se aplica el porcentaje resultante sobre
 *    el valor resultante del flat.
 */
    private calculateEffectiveStat(
        target: CombatStatKey,
        baseValue: number,
        modifiers: CombatStatModifier[]
    ): number {
        let flat = 0;
        let increased = 0;
        let reduced = 0;

        for (const modifier of modifiers) {
            switch (modifier.operation) {
                case 'flat':
                    flat += modifier.value;
                    break;

                case 'increased':
                    increased += modifier.value;
                    break;

                case 'reduced':
                    reduced += modifier.value;
                    break;
            }
        }

        const valueWithFlat = baseValue + flat;

        const percentageModifier = increased - reduced;

        const calculatedValue =
            valueWithFlat +
            Math.abs(valueWithFlat) *
            (percentageModifier / 100);


        /*
         * Finalmente se aplica el límite de la stat,
         * si existe uno configurado.
         */
        return this.applyStatLimit(
            target,
            calculatedValue
        );
    }

    private setNumericStatByPath(
        stats: FighterBaseStats,
        path: CombatStatKey,
        value: number
    ): void {
        if (!Number.isFinite(value)) {
            throw new Error(
                `El valor ${value} no es un número válido para la estadística ${path}.`
            );
        }

        const segments = path.split('.');

        let current: unknown = stats;

        for (let i = 0; i < segments.length - 1; i++) {
            const segment = segments[i];

            if (
                current === null ||
                typeof current !== 'object' ||
                !(segment in current)
            ) {
                throw new Error(
                    `No se encontró la estadística ${path}.`
                );
            }

            current = (current as Record<string, unknown>)[segment];
        }

        const lastSegment = segments[segments.length - 1];

        if (
            current === null ||
            typeof current !== 'object' ||
            !(lastSegment in current)
        ) {
            throw new Error(
                `No se encontró la estadística ${path}.`
            );
        }

        const currentValue =
            (current as Record<string, unknown>)[lastSegment];

        if (
            typeof currentValue !== 'number' ||
            !Number.isFinite(currentValue)
        ) {
            throw new Error(
                `La estadística ${path} no contiene un valor numérico válido.`
            );
        }

        (current as Record<string, unknown>)[lastSegment] = value;
    }

    private applyStatLimit(
        target: CombatStatKey,
        value: number
    ): number {
        const bonusRefKey = COMBAT_STAT_TO_BONUS_REF[target];

        if (!bonusRefKey) {
            return value;
        }

        const limit = LIMIT_BONUS_CONFIG[target as BonusRefKeys];

        if (limit === undefined) {
            return value;
        }

        return Math.min(value, limit);
    }



}