import { BuffType } from "netim2-shared";

export const BASE_BUFF_ITEM = {
    type_utility: 'buff',
    type: 'utility',
    size: {cols:1,rows:1},
    acc: true
} satisfies Partial<BuffType>;