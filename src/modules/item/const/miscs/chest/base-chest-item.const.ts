import { ChestType } from "src/modules/item/types/entities-props/chest.type";

export const BASE_CHEST_ITEM = {
    acc: true,
    cantidad: 1,
    lvUtility: 1,
    size: {cols: 1,rows: 1},
    type: 'utility',
    type_utility: 'chest',
} satisfies Partial<ChestType>;