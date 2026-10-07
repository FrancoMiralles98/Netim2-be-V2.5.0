import { MonturaDescription, MonturaType } from "netim2-shared";

export const LICENCIA_MONTURA_BASE_ITEM = {
    cantidad: 1,
    maxCantidad: 1,
    acc: true,
    type: 'utility',
    type_utility: 'montura',
    size: {rows: 1, cols: 1},
    montura: {} as MonturaDescription
} satisfies Partial<MonturaType>