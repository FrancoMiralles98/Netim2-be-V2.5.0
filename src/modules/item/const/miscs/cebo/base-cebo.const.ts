import { CeboType } from "netim2-shared";

export const BASE_CEBO = {
type_utility: 'cebo',
acc: true,
lvUtility: 1,
maxCantidad: 200,
size: {cols: 1,rows: 1},
type: 'utility',
corrupt: false,
cantidad: 1,
img: '',
} satisfies Partial<CeboType>