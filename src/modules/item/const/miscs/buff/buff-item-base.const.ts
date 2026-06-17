import { BuffType } from "src/modules/item/types/entities-props/buff.type";

export const BASE_BUFF_ITEM = {
    type_utility: 'buff',
    type: 'utility',
    size: {cols:1,rows:1},
    acc: true
} satisfies Partial<BuffType>;