import { BasicAttackActionResolverService } from './basic-attack-action-resolver.service';

describe('BasicAttackActionResolverService attack speed', () => {
    const rollChance = jest.fn();
    let resolveSequence: (speed: number) => {
        hitCount: number;
        missChance: number;
        extraAttackTriggered: boolean;
    };

    beforeEach(() => {
        rollChance.mockReset();
        const resolver = Object.create(BasicAttackActionResolverService.prototype);
        resolver.rngService = { rollChance };
        resolveSequence = speed => resolver.resolveAttackSequence(speed);
    });

    it.each([
        [0, 1],
        [100, 2],
        [200, 3],
        [300, 4],
    ])('generates %s VA as a guaranteed sequence of %s hits', (speed, hits) => {
        expect(resolveSequence(speed)).toEqual({
            hitCount: hits,
            missChance: 0,
            extraAttackTriggered: hits > 1,
        });
        expect(rollChance).not.toHaveBeenCalled();
    });

    it.each([
        [5, 1, 2],
        [105, 2, 3],
        [205, 3, 4],
    ])('rolls only the remaining 5%% at %s VA', (speed, withoutExtra, withExtra) => {
        rollChance.mockReturnValue(false);
        expect(resolveSequence(speed).hitCount).toBe(withoutExtra);
        rollChance.mockReturnValue(true);
        expect(resolveSequence(speed).hitCount).toBe(withExtra);
        expect(rollChance).toHaveBeenNthCalledWith(1, 5);
        expect(rollChance).toHaveBeenNthCalledWith(2, 5);
    });

    it('preserves negative VA as a miss chance without extra attacks', () => {
        expect(resolveSequence(-25)).toEqual({
            hitCount: 1,
            missChance: 25,
            extraAttackTriggered: false,
        });
        expect(rollChance).not.toHaveBeenCalled();
    });
});
