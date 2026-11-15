import { NotFoundException } from '@nestjs/common';
import { IdMob } from 'netim2-shared';
import { MOB_LIST } from '../const/mob-list.const';
import { MobFactory } from '../factory/mob.factory';
import { MobInfoService } from './mob-info.service';

describe('MobInfoService', () => {
    const service = new MobInfoService(new MobFactory());
    afterEach(() => jest.restoreAllMocks());

    it('rebuilds from the current level, profile and partial overrides on every request', () => {
        const definition = structuredClone(MOB_LIST[0]);
        definition.lv = 10;
        definition.combatProfile = 'tank';
        definition.stats = { general: { ad: { min: 77 } } };
        jest.spyOn(MOB_LIST, 'find').mockReturnValue(definition);
        const original = structuredClone(definition);
        const result = service.getMobInfo(definition.idMob);
        expect(result.stats.general.hp).toEqual({ max: 672, actual: 672 });
        expect(result.stats.general.def).toBe(19);
        expect(result.stats.general.ad).toEqual({ min: 77, max: 78 });
        expect(definition).toEqual(original);
        definition.lv = 20;
        expect(service.getMobInfo(definition.idMob).stats.general.hp.max).toBe(1400);
    });

    it('isolates returned data from the catalog and subsequent requests', () => {
        const original = structuredClone(MOB_LIST);
        const result = service.getMobInfo(IdMob.PERRO_SALVAJE);
        result.yang.min = -100;
        result.spawnConfig.canSpawn = true;
        result.stats.general.hp.max = -100;
        expect(MOB_LIST).toEqual(original);
        expect(service.getMobInfo(IdMob.PERRO_SALVAJE).stats.general.hp.max).toBe(120);
    });

    it('rejects unknown IDs instead of returning an incomplete mob', () => {
        jest.spyOn(MOB_LIST, 'find').mockReturnValue(undefined);
        expect(() => service.getMobInfo(IdMob.PERRO_SALVAJE)).toThrow(NotFoundException);
    });
});
