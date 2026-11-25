import { Test } from '@nestjs/testing';
import { FightModule } from './fight.module';
import { FightService } from './fight.service';
import { FighterCombatFactory } from './factories/fighter-combat-entity.factory';
import { GENERAL_CHARACTER } from '../character/const/general-character.const';
import { MobFactory } from '../mob/factory/mob.factory';
import { CITY1_MOB_LIST } from '../mob/const/list/city1-mobs.list';
import { SkillAura, UNIQUE_ID_SKILLS } from 'netim2-shared';
import { InitialAurasProcessorService } from './services/processors/initial-auras-processor.service';
import { FightFactory } from './factories/fight.factory';

describe('FightService', () => {
    const aura = (id: UNIQUE_ID_SKILLS, amount: number, lv = 1): SkillAura => ({
        id, lv, mastery: 'N', nombre: 'Aura', description: '', type: 'aura',
        mana: { type: 'instant', amount }, cd: { onActivate: 5 },
        duration: { type: 'turns', turns: 10 }, tags: [],
        statsModifiers: [{ operation: 'flat', target: 'general.def', bonusRefKey: 'def', value: 10 }],
        escalado: {
            type: 'aura', tags: [], statsModifiers: [], mana: { type: 'none' }, cd: {},
            duration: { type: 'turns', turns: { progression: { type: 'constant', value: 10 } } },
        },
    });

    it('activa las auras antes del primer turno por defecto y permite desactivar esa preparación', async () => {
        const module = await Test.createTestingModule({ imports: [FightModule] }).compile();
        try {
            const processor = jest.spyOn(module.get(InitialAurasProcessorService), 'process');
            for (const startWithAuras of [undefined, false]) {
                const character = structuredClone(GENERAL_CHARACTER);
                character.stats.general.hp = { max: 1000, actual: 1000 };
                character.stats.general.mana = { max: 100, actual: 100 };
                character.hab = [aura(UNIQUE_ID_SKILLS.BENDICION, 30)];
                const { allies, enemies } = module.get(FighterCombatFactory).createSidesWithMobs(
                    [{ ...character, id: 'character' }], [new MobFactory().create(CITY1_MOB_LIST[0])],
                );
                const result = module.get(FightService).fight(allies, enemies, 1, { startWithAuras });
                const firstTurn = result.fightPlaybackPayload.turns[0];
                expect(firstTurn.turnNumber).toBe(startWithAuras === false ? 1 : 0);
                if (startWithAuras !== false) {
                    expect(firstTurn.fighterTurns[0].events).toEqual(expect.arrayContaining([
                        expect.objectContaining({ type: 'aura_activated', skillId: UNIQUE_ID_SKILLS.BENDICION }),
                        expect.objectContaining({ type: 'resource_changed', previousValue: 100, currentValue: 70 }),
                    ]));
                }
            }
            expect(processor).toHaveBeenCalledTimes(1);
        } finally {
            await module.close();
        }
    });

    it.each([
        { lv: 1, cost: 10, consumesTurn: true },
        { lv: 0, cost: 10, consumesTurn: false },
        { lv: 1, cost: 1000, consumesTurn: false },
    ])('consume solo la primera acción si realmente activó auras: %j', async ({ lv, cost, consumesTurn }) => {
        const module = await Test.createTestingModule({ imports: [FightModule] }).compile();
        try {
            const character = structuredClone(GENERAL_CHARACTER);
            character.stats.general.hp = { max: 100000, actual: 100000 };
            character.stats.general.mana = { max: 100, actual: 100 };
            character.stats.general.ad = { min: 1, max: 1 };
            character.hab = [
                aura(UNIQUE_ID_SKILLS.BENDICION, cost, lv),
                aura(UNIQUE_ID_SKILLS.REFLECTAR, cost, lv),
            ];
            const mob = new MobFactory().create(CITY1_MOB_LIST[0]);
            mob.stats.general.hp = { max: 100000, actual: 100000 };
            mob.stats.general.ad = { min: 1, max: 1 };
            mob.hab = [];
            const { allies, enemies } = module.get(FighterCombatFactory).createSidesWithMobs(
                [{ ...character, id: 'character' }], [mob],
            );
            const skippedByStun = jest.spyOn(allies[0].statistics, 'registerSkippedTurnByStun');
            const result = module.get(FightService).fight(allies, enemies, 4);
            const fighterTurns = result.fightPlaybackPayload.turns
                .filter(turn => turn.turnNumber > 0)
                .flatMap(turn => turn.fighterTurns);
            const actions = (fighterId: string) => fighterTurns
                .filter(turn => turn.fighterId === fighterId)
                .flatMap(turn => turn.events)
                .filter(event => event.type === 'action_selected')
                .map(event => event.action.type);
            expect(actions(allies[0].id)).toEqual([
                consumesTurn ? 'skip_turn' : 'basic_attack',
                'basic_attack',
            ]);
            expect(actions(enemies[0].id)).toEqual(['basic_attack', 'basic_attack']);
            expect(skippedByStun).not.toHaveBeenCalled();
        } finally {
            await module.close();
        }
    });

    it('omite auras sin aprender o sin maná, consume el presupuesto restante y evita duplicados', async () => {
        const module = await Test.createTestingModule({ imports: [FightModule] }).compile();
        try {
            const character = structuredClone(GENERAL_CHARACTER);
            character.stats.general.mana = { max: 50, actual: 50 };
            character.hab = [
                aura(UNIQUE_ID_SKILLS.BENDICION, 30),
                aura(UNIQUE_ID_SKILLS.REFLECTAR, 30),
                aura(UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON, 1, 0),
            ];
            const mob = new MobFactory().create(CITY1_MOB_LIST[0]);
            const freeAura = aura(UNIQUE_ID_SKILLS.BENDICION, 0);
            freeAura.mana = { type: 'none' };
            mob.hab = [freeAura];
            const { allies, enemies } = module.get(FighterCombatFactory).createSidesWithMobs(
                [{ ...character, id: 'character' }], [mob],
            );
            const fight = module.get(FightFactory).create(allies, enemies, 1);
            const processor = module.get(InitialAurasProcessorService);
            const preparation = processor.process(fight);
            expect(preparation?.fighterTurns).toHaveLength(2);
            expect(allies[0].getCurrentMana()).toBe(20);
            expect(allies[0].getActiveAuras()).toHaveLength(1);
            expect(enemies[0].getActiveAuras()).toHaveLength(1);
            expect(processor.process(fight)).toBeUndefined();
        } finally {
            await module.close();
        }
    });

    it('ejecuta el motor real con los bandos preparados y devuelve FightResponse', async () => {
        const module = await Test.createTestingModule({ imports: [FightModule] }).compile();
        try {
            const character = structuredClone(GENERAL_CHARACTER);
            character.stats.general.hp = { max: 1000, actual: 1000 };
            character.stats.general.ad = { min: 10000, max: 10000 };
            character.hab = [];
            const mob = new MobFactory().create(CITY1_MOB_LIST[0]);
            const factory = module.get(FighterCombatFactory);
            const { allies, enemies } = factory.createSidesWithMobs([{ ...character, id: 'character' }], [mob]);
            const result = module.get(FightService).fight(allies, enemies, 10);
            expect(result).toMatchObject({
                result: expect.anything(),
                initialFighters: expect.any(Array),
                initiativeResults: expect.any(Array),
                fighterFightSummary: expect.any(Array),
                fightPlaybackPayload: { fightId: expect.any(String), turns: expect.any(Array) },
            });
            expect(result.initialFighters).toHaveLength(2);
            expect(result.fighterFightSummary).toEqual(expect.arrayContaining([
                expect.objectContaining({ fighterId: enemies[0].id, alive: false }),
            ]));
        } finally {
            await module.close();
        }
    });
});
