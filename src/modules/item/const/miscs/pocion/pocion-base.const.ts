import { PocionType } from "src/modules/item/types/entities-props/pocion.type";

export const POCION_BASE_ITEM = {
acc:true,
cantidad: 1,
size: {cols:1,rows:1},
lvUtility: 1,
type_utility: 'poción',
type: 'utility',
} satisfies Partial<PocionType>