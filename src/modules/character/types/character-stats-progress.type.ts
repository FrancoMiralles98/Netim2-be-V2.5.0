import type { BonusRefKeys } from 'netim2-shared';

type ProgressStatKey = Extract<BonusRefKeys, 'hp' | 'mana' | 'ap' | 'ad' | 'regen_hp' | 'regen_mana'>;

export type CharacterStatsProgress = {
    base: Record<ProgressStatKey, number>;
    per_lv: Record<ProgressStatKey, number>;
};
