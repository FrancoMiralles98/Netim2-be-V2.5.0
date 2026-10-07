import { UtilityType } from "netim2-shared";

export const BASE_GENERIC_UTILITY = {
    type: 'utility',
    type_utility: 'utility',
    size: {cols:1,rows:1},
    acc: true,
    lvUtility: 0,
    cantidad:1
} satisfies Partial<UtilityType>;