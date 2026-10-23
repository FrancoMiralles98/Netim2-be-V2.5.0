import { IdItem } from 'netim2-shared';
import { CHEST_LIST } from '../const/miscs/chest/chest-list.const';
import type { ChestType, Reward } from 'netim2-shared';
import { Chest } from './chest.entity';

describe('Chest selection and weighted RNG', () => {
    const rewards: Reward[] = [
        { type_reward: 'resource', type_resource: 'yang', value_reward: 10, weight: 0 },
        { type_reward: 'item', idItem: IdItem.ESPADA, weight: 0.25 },
        { type_reward: 'item', idItem: IdItem.POCION_ROJA_P, weight: 250.75 },
    ];
    const definition = (props: object): ChestType => ({ ...CHEST_LIST[0], rewards, ...props } as ChestType);
    afterEach(() => jest.restoreAllMocks());

    it('handles weights above 100, decimals and zero without mutating the config', () => {
        const props = definition({ rewardConfig: 'random' });
        const before = structuredClone(props);
        const random = jest.spyOn(Math, 'random').mockReturnValue(0);
        expect(new Chest(props).open()).toEqual([rewards[1]]);
        random.mockReturnValue(0.5);
        expect(new Chest(props).open()).toEqual([rewards[2]]);
        expect(props).toEqual(before);
    });

    it('returns all rewards without consulting RNG', () => {
        const random = jest.spyOn(Math, 'random');
        expect(new Chest(definition({ rewardConfig: 'all' })).open()).toEqual(rewards);
        expect(random).not.toHaveBeenCalled();
    });

    it('returns the exact distinct item selection for pick, ignoring weights', () => {
        expect(new Chest(definition({ rewardConfig: 'pick', pickCount: 2 }))
            .open([IdItem.POCION_ROJA_P, IdItem.ESPADA])).toEqual([rewards[2], rewards[1]]);
    });

    it('rejects invalid counts, duplicate or foreign selections and ambiguous item IDs', () => {
        const chest = new Chest(definition({ rewardConfig: 'pick', pickCount: 2 }));
        for (const ids of [undefined, [], [IdItem.ESPADA], [IdItem.ESPADA, IdItem.ESPADA], [IdItem.ESPADA, IdItem.POCION_ROJA_M]]) {
            expect(() => chest.open(ids)).toThrow();
        }
        expect(() => new Chest(definition({ rewardConfig: 'pick', pickCount: 0 })).open([])).toThrow();
        expect(() => new Chest(definition({ rewardConfig: 'pick', pickCount: 1, rewards: [rewards[1], rewards[1]] }))
            .open([IdItem.ESPADA])).toThrow('ambiguo');
        expect(() => new Chest(definition({ rewardConfig: 'all' })).open([])).toThrow('no permite');
    });

    it.each([[], [{ ...rewards[1], weight: 0 }], [{ ...rewards[1], weight: -1 }], [{ ...rewards[1], weight: NaN }]].map(rewards => ({ rewards })))(
        'rejects empty or invalid weighted tables %o', ({ rewards: invalid }) => {
            expect(() => new Chest(definition({ rewardConfig: 'random', rewards: invalid })).open()).toThrow();
        });
});
