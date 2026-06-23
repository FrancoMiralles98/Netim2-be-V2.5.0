import { PiedraType } from "src/modules/item/types/entities-props/piedra.type";

export const BASE_PIEDRA_ITEM = {
    type_utility: 'piedra',
    type: 'utility',
    size: {cols:1,rows:1},
    upgradeLv: 0,
    implicitBonus: [],
    acc: false,
    lvUtility: 0,
    maxCantidad: 1,
    cantidad:1
} satisfies Partial<PiedraType>;