import { AppliedBuffos } from 'netim2-shared';
import { CharacterBuffService } from './character-buff.service';

describe('CharacterBuffService', () => {
    const service = new CharacterBuffService();
    const start = 100_000;

    function buff(duration: number, initialized = start): AppliedBuffos {
        return {
            implicitBonus: [], corruptBonus: [], buff_duration: duration,
            buff_base_duration: 999, buff_inicialization: initialized,
            id_buff: 1, buff_name: 'Buff', buff_description: '',
        };
    }

    afterEach(() => jest.restoreAllMocks());

    it('removes expired buffs using their actual duration without mutating the input', () => {
        const clock = jest.spyOn(Date, 'now').mockReturnValue(start + 60_000);
        const buffs = [buff(30), buff(60), buff(61), buff(120)];
        const original = structuredClone(buffs);
        expect(service.removeExpiredBuffs(buffs)).toEqual([buffs[2], buffs[3]]);
        expect(buffs).toEqual(original);
        expect(clock).toHaveBeenCalledTimes(1);
    });

    it.each([[59_999, 1], [60_000, 0], [60_001, 0]])(
        'at elapsed %i milliseconds returns %i active buffs', (elapsed, expected) => {
            jest.spyOn(Date, 'now').mockReturnValue(start + elapsed);
            expect(service.removeExpiredBuffs([buff(60)])).toHaveLength(expected);
        },
    );

    it('returns an empty array for no buffs or a zero-duration buff applied now', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start);
        expect(service.removeExpiredBuffs([])).toEqual([]);
        expect(service.removeExpiredBuffs([buff(0)])).toEqual([]);
    });
});
