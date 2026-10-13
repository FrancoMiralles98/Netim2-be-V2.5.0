import { BonusRefKeys } from 'netim2-shared';
import { BONUS_LIST } from '../../bonus/const/bonus-list.cons';
import { BonusSharedService } from './bonus-shared.service';

describe('BonusSharedService', () => {
    const service = new BonusSharedService();

    it('returns the current contract with the supplied value and origin', () => {
        const definition = BONUS_LIST.find(bonus => bonus.bonus_ref_name === 'hp')!;
        const result = service.transformToBonusInItem('hp', 100, 'random');
        expect(result).toEqual({
            bonusFullName: definition.full_name, bonusRef: 'hp', bonusValue: 100,
            category: definition.category, effects: definition.effects, origin: 'random',
        });
        expect(result).not.toHaveProperty('bonusValueType');
    });

    it('preserves damage ranges and isolates category/effects from catalog objects', () => {
        const definition = BONUS_LIST.find(bonus => bonus.bonus_ref_name === 'ad')!;
        const result = service.transformToBonusInItem('ad', { min: 10, max: 20 }, 'configured');
        expect(result.bonusValue).toEqual({ min: 10, max: 20 });
        expect(result.origin).toBe('configured');
        expect(result.category).toEqual(definition.category);
        expect(result.category).not.toBe(definition.category);
        expect(result.effects).toEqual(definition.effects);
        expect(result.effects).not.toBe(definition.effects);
    });

    it('rejects references absent from the catalog', () => {
        expect(() => service.transformToBonusInItem('missing' as BonusRefKeys, 1, 'configured'))
            .toThrow('No se encuentra la informacion del bonus ref: missing');
    });
});
