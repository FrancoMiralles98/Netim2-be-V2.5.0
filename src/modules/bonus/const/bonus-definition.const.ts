import { allFullNameBonusList, BonusType } from "netim2-shared";

export const BONUS_DEFINITION_CONST: BonusType[] = [
    {
        category: { type: 'generic', tier: 1 },
        full_name: allFullNameBonusList.VELOCIDAD_DE_HECHIZO,
        bonus_ref_name: 'vh',
        effects: { type: 'stat_modifiers', operation: 'flat', target: ['general.vh'] },
        values: { min: 10, max: 20 },
        displayFormat: 'flat',
        valid: [],
    },
] 