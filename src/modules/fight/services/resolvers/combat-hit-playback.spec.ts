import { Test, TestingModule } from '@nestjs/testing';
import { SkillDamage, Stats, UNIQUE_ID_SKILLS } from 'netim2-shared';
import { FightModule } from '../../fight.module';
import { FightService } from '../../fight.service';
import { FightFactory } from '../../factories/fight.factory';
import { FighterCombatFactory } from '../../factories/fighter-combat-entity.factory';
import { GENERAL_CHARACTER } from '../../../character/const/general-character.const';
import { RngService } from '../../../shared/services/rng.service';
import { BasicAttackActionResolverService } from './basic-attack-action-resolver.service';
import { DamageSkillActionResolver } from './damage-skill-action-resolver.service';
import { StatusEffectApplicationResolverService } from './status-effect-application-resolver.service';
import { PeriodicStatusEffectResolverService } from './periodic-status-effect-resolver.service';
import { TurnContext } from '../../types/fight/fight-context.types';

describe('Resolución y reproducción por hit', () => {
    let module: TestingModule;
    beforeAll(async () => {
        module = await Test.createTestingModule({ imports: [FightModule] }).compile();
        jest.spyOn(module.get(RngService), 'randomNumberInRange').mockImplementation(min => min ?? 0);
        jest.spyOn(module.get(RngService), 'rollChance').mockImplementation(chance => chance > 0);
    });
    afterAll(async () => { await module.close(); });

    const skill = (): SkillDamage => ({
        type: 'damage', id: UNIQUE_ID_SKILLS.LLAMADA_RELAMPAGO, lv: 1, mastery: 'N', nombre: 'Rayo', description: '',
        mana: { type: 'instant', amount: 10 }, cd: { onActivate: 5 }, weaponRestricted: [],
        components: { damageType: 'true', range: { min: 100, max: 100 }, tags: [] },
        hitModifiers: { type: 'chance_multi_hit', chance: 100, hits: 3, damageMultiplierPerHit: 0.5 },
        damageModifiers: { type: 'chance_multiplier', chance: 100, multiplier: 2 },
        mechanicsEffects: { vampirismo_hechizo: 10 },
        escalado: { type: 'damage', mana: { type: 'none' }, cd: {}, components: {
            damageType: 'true', tags: [], damage: { type: 'damage', range: {
                min: { progression: { type: 'constant', value: 100 } },
                max: { progression: { type: 'constant', value: 100 } },
            } },
        } },
    });

    function prepare(options: { actor?: (stats: Stats) => void; target?: (stats: Stats) => void; skill?: SkillDamage } = {}) {
        const factory = module.get(FighterCombatFactory);
        const stats = structuredClone(GENERAL_CHARACTER.stats);
        stats.general.hp = { actual: 100, max: 1000 };
        stats.general.mana = { actual: 1000, max: 1000 };
        stats.general.ad = { min: 100, max: 100 };
        stats.general.va = 200;
        stats.general.def = 0;
        const targetStats = structuredClone(stats);
        targetStats.general.hp = { actual: 10000, max: 10000 };
        options.actor?.(stats);
        options.target?.(targetStats);
        const base = { fightConfig: structuredClone(GENERAL_CHARACTER.fightConfig),
            targetType: GENERAL_CHARACTER.target_type, race: GENERAL_CHARACTER.raza };
        const actor = factory.createFighter({ ...base, stats, id: 'actor', name: 'Actor', skills: options.skill ? [options.skill] : [] });
        const target = factory.createFighter({ ...base, stats: targetStats, id: 'target', name: 'Target', skills: [] });
        const fight = module.get(FightFactory).create([actor], [target], 10);
        const context: TurnContext = { fight, actor, turnNumber: 1, events: [] };
        return { actor, target, context };
    }

    it('cura por golpe, limita la curación a la vida faltante y conserva los totales', () => {
        const { actor, target, context } = prepare({ actor: stats => {
            stats.general.hp.actual = 985;
            stats.bonus.defensa.robo_vida = 10;
        } });
        const result = module.get(BasicAttackActionResolverService).resolve({ context,
            action: { type: 'basic_attack', targetId: target.id } });
        expect(result.hitResults.map(hit => hit.healing.effectiveHealing)).toEqual([10, 5, 0]);
        expect(result.lifeSteal.effectiveHealing).toBe(15);
        expect(result.hitResults[2].healing.overhealing).toBe(10);
        expect(actor.getCurrentHp()).toBe(1000);
        expect(actor.statistics.snapshot.healing.byBasicAttack).toBe(15);
        expect(result.hitResults.every(hit => hit.damage.direct === 100 && hit.damage.additional === 0)).toBe(true);
    });

    it('detona electricidad en el tercer hit y no vuelve a detonarla durante el tick', () => {
        const { actor, target, context } = prepare({ actor: stats => { stats.bonus.daño.electrico = 100; } });
        const result = module.get(BasicAttackActionResolverService).resolve({ context,
            action: { type: 'basic_attack', targetId: target.id } });
        const electric = result.hitResults.map(hit => hit.statusEffects.find(effect => effect.effectId === 'electrico')!);
        expect(electric.map(effect => effect.after!.stacks!.current)).toEqual([1, 2, 0]);
        expect(electric[1].before!.stacks!.current).toBe(1);
        expect(electric[2].changes).toEqual(expect.arrayContaining(['stack_added', 'stack_triggered', 'duration_refreshed']));
        expect(electric[2].stackProc!.appliedDamage).toBeGreaterThan(0);
        expect(result.hitResults[2].damage.additional).toBe(electric[2].stackProc!.appliedDamage);
        expect(actor.statistics.snapshot.damage.dealt.total).toBe(300 + electric[2].stackProc!.appliedDamage);
        expect(context.events.filter(event => event.type === 'status_effect_stack_proc')).toHaveLength(1);
        const effect = target.getActiveStatusEffectByEffectId('electrico')!;
        const periodic = module.get(PeriodicStatusEffectResolverService).resolve({
            effect, fight: context.fight, target, context: { ...context, actor: target, turnNumber: 2, events: [] },
        });
        expect(periodic.stackProc).toBeUndefined();
        expect(periodic.totalAppliedDamage).toBe(periodic.tickDamage.effectiveDamage);
        expect(electric[0].after!.stacks!.current).toBe(1);
    });

    it.each(['basic_attack', 'skill'] as const)('expone el crítico real de cada hit de %s', source => {
        const ability = skill();
        const { actor, target, context } = prepare({ skill: ability, actor: stats => {
            stats.bonus.daño.critico = 100; stats.bonus.daño.daño_critico = 2;
        } });
        const result = source === 'skill'
            ? module.get(DamageSkillActionResolver).resolve({ context,
                action: { type: 'use_damage_skill', skillId: ability.id, targetId: target.id } })
            : module.get(BasicAttackActionResolverService).resolve({ context,
                action: { type: 'basic_attack', targetId: target.id } });
        expect(result.hitResults.every(hit => hit.critical && hit.damage.direct === 200)).toBe(true);
        expect(actor.statistics.snapshot.damage.dealt.total).toBe(600);
    });

    it('si una explosión mata al objetivo, no ejecuta los golpes restantes', () => {
        const { actor, target, context } = prepare({ actor: stats => { stats.bonus.daño.electrico = 100; },
            target: stats => { stats.general.hp = { actual: 150, max: 150 }; } });
        const effects = module.get(StatusEffectApplicationResolverService);
        for (let i = 0; i < 2; i++) effects.resolveEffects({ source: actor, target, context, appliedOnTurn: 0,
            triggeringDamage: 100, isCritic: false, effect: { electrico: 100 } });
        const result = module.get(BasicAttackActionResolverService).resolve({ context,
            action: { type: 'basic_attack', targetId: target.id } });
        expect(result.hitResults).toHaveLength(1);
        expect(result.modifiers).toMatchObject({ plannedHitCount: 3, executedHitCount: 1 });
        expect(result.hitResults[0].damage).toEqual({ direct: 100, additional: 50, total: 150 });
        expect(result.hitResults[0].targetDefeated).toBe(true);
    });

    it('devuelve los estados resistidos asociados al hit sin aplicarlos', () => {
        const { target, context } = prepare({ actor: stats => { stats.bonus.cc.desmayo = 100; },
            target: stats => { stats.bonus.defensa.def_desmayo = 100; } });
        const result = module.get(BasicAttackActionResolverService).resolve({ context,
            action: { type: 'basic_attack', targetId: target.id } });
        expect(result.hitResults[0].statusEffects).toEqual(expect.arrayContaining([
            expect.objectContaining({ effectId: 'desmayo', applied: false, resisted: true, changes: [] }),
        ]));
        expect(target.hasActiveStatusEffect('desmayo')).toBe(false);
    });

    it('informa reemplazo de daño y acumulación de duración sin perder las capturas anteriores', () => {
        const { actor, target, context } = prepare();
        const resolver = module.get(StatusEffectApplicationResolverService);
        const apply = (damage: number) => resolver.resolveEffects({ source: actor, target, context,
            effect: { veneno: 100 }, triggeringDamage: damage, isCritic: false, appliedOnTurn: 1 })[0];
        const first = apply(100);
        const stronger = apply(200);
        const weaker = apply(50);
        expect(first.changes).toEqual(['applied']);
        expect(stronger.changes).toEqual(expect.arrayContaining(['duration_accumulated', 'damage_replaced']));
        expect(weaker.changes).toContain('damage_kept');
        expect(stronger.after!.remainingTurns).toBe(20);
        expect(first.after!.remainingTurns).toBe(10);
        expect(weaker.after!.damagePerTick).toBe(stronger.after!.damagePerTick);
    });

    it('un básico esquivado no aplica estados ni recupera vida', () => {
        const { target, context } = prepare({ actor: stats => {
            stats.bonus.daño.electrico = 100; stats.bonus.defensa.robo_vida = 100;
        }, target: stats => { stats.bonus.defensa.esquivar_ataques = 100; } });
        const result = module.get(BasicAttackActionResolverService).resolve({ context,
            action: { type: 'basic_attack', targetId: target.id } });
        expect(result.hitResults.every(hit => hit.outcome === 'dodged' && hit.statusEffects.length === 0
            && hit.healing.effectiveHealing === 0 && hit.damage.total === 0)).toBe(true);
    });

    it('separa modificadores seleccionados, hits previstos/ejecutados y vampirismo por golpe', () => {
        const ability = skill();
        const { actor, target, context } = prepare({ skill: ability, target: stats => {
            stats.general.hp = { actual: 150, max: 150 };
        } });
        const result = module.get(DamageSkillActionResolver).resolve({ context,
            action: { type: 'use_damage_skill', skillId: ability.id, targetId: target.id } });
        expect(result.modifiers).toMatchObject({ plannedHitCount: 3, executedHitCount: 2,
            damageMultiplierPerHit: 0.5, skillDamageMultiplier: 2, damageModifierApplied: true });
        expect(result.hitResults.map(hit => hit.damage.direct)).toEqual([100, 50]);
        expect(result.hitResults.map(hit => hit.healing.effectiveHealing)).toEqual([10, 5]);
        expect(result.hitResults[1].targetDefeated).toBe(true);
        expect(actor.getCurrentMana()).toBe(990);
        expect(result.lifeSteal.effectiveHealing).toBe(15);
        const damageEvents = context.events.filter(event => event.type === 'damage_resolved');
        expect(damageEvents.map(event => event.hitIndex)).toEqual([0, 1]);
    });

    it('interrumpe los hits restantes si el daño reflejado mata al atacante', () => {
        const { target, context } = prepare({ actor: stats => { stats.general.hp.actual = 1; },
            target: stats => { stats.bonus.defensa.reflectar = 100; } });
        const result = module.get(BasicAttackActionResolverService).resolve({ context,
            action: { type: 'basic_attack', targetId: target.id } });
        expect(result.modifiers).toMatchObject({ plannedHitCount: 3, executedHitCount: 1 });
        expect(result.hitResults[0].attackerDefeated).toBe(true);
        expect(result.hitResults[0].reflectedDamage).toBe(1);
    });

    it('publica el resultado por hit en la respuesta real de combate', () => {
        const { actor, target } = prepare();
        const result = module.get(FightService).fight([actor], [target], 1, { startWithAuras: false });
        const turn = result.fightPlaybackPayload.turns[0].fighterTurns[0];
        expect(turn.attack?.hits).toHaveLength(3);
        expect(turn.attack).toMatchObject({ totalDirectDamage: 300, totalAdditionalDamage: 0, totalAppliedDamage: 300 });
        expect(turn.attack?.hits[0]).toMatchObject({ source: { type: 'basic_attack' }, attackerId: turn.fighterId });
    });
});
