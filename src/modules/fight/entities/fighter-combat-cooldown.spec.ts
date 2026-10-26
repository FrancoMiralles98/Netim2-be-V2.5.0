import { UNIQUE_ID_SKILLS } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../../character/const/general-character.const';
import { GENERAL_CHARACTER_STATS } from '../../character/const/characterProps/base-character-stats.const';
import { FighterCombatEntity } from './fighter-combat.entity';
import { calculateCooldownReductionPercent } from '../../gameData/const/calculate-cooldown-reduction';

describe('FighterCombatEntity cooldown scaling', () => {
    function fighter(vh: number) {
        const stats = structuredClone(GENERAL_CHARACTER_STATS);
        return new FighterCombatEntity({
            id: 'fighter', name: 'fighter', targetType: 'medio_humanos', skills: [],
            fightConfig: structuredClone(GENERAL_CHARACTER.fightConfig),
            baseStats: {
                ...stats,
                general: { ...stats.general, regenHp: stats.general.regen_hp, regenMana: stats.general.regen_mana, vh },
            },
        });
    }

    it.each([[-50, 100], [0, 100], [80, 65], [100, 61], [300, 20], [600, 20]])('applies the configured curve at %i VH', (vh, expected) => {
        const entity = fighter(vh);
        const id = 1 as UNIQUE_ID_SKILLS;
        expect(entity.startSkillCooldown(id, 100)).toEqual({ initialTurns: expected, remainingTurns: expected });
        expect(entity.getSkillRemainingCooldown(id)).toBe(expected);
        expect(entity.startSkillCooldown(id, 0)).toEqual({ initialTurns: 0, remainingTurns: 0 });
        expect(entity.getSkillCooldown(id)).toBeUndefined();
    });

    it.each([[0.6, 0.59], [1, 0.98], [5, 4.63], [100, 39.63], [300, 80]])(
        'starts near 1%% per point and reaches 80%% at %s VH', (vh, expected) => {
            expect(calculateCooldownReductionPercent(vh)).toBeCloseTo(expected, 2);
        },
    );
});
