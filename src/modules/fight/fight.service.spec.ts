import { Test } from '@nestjs/testing';
import { FightModule } from './fight.module';
import { FightService } from './fight.service';
import { FighterCombatFactory } from './factories/fighter-combat-entity.factory';
import { GENERAL_CHARACTER } from '../character/const/general-character.const';
import { MobFactory } from '../mob/factory/mob.factory';
import { CITY1_MOB_LIST } from '../mob/const/list/city1-mobs.list';

describe('FightService', () => {
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
