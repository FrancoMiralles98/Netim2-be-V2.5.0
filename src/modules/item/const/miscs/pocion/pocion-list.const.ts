import { IdItem, PocionType } from "netim2-shared";
import { createPocionItem } from "src/modules/item/factories/item-builder";


export const POCION_LIST: PocionType[] = [
    createPocionItem({
        name: 'Poción Roja(P)',
        img: '/items/Poción_Roja(P).png',
        maxCantidad: 200,
        effect: [{ bonusRef: 'hp', bonusValue: 300 }],
        price: 25,
        description: '',
        idItem: IdItem.POCION_ROJA_P,
    }),
    createPocionItem({
        name: 'Poción Roja(M)',
        img: '/items/Poción_Roja(M).png',
        maxCantidad: 200,
        effect: [{ bonusRef: 'hp', bonusValue: 700 }],
        price: 50,
        description: '',
        idItem: IdItem.POCION_ROJA_M,
    }),
    createPocionItem({
        name: 'Poción Roja(G)',
        img: '/items/Poción_Roja(G).png',
        maxCantidad: 200,
        effect: [{ bonusRef: 'hp', bonusValue: 1500 }],
        price: 100,
        description: '',
        idItem: IdItem.POCION_ROJA_G,
    }),
    createPocionItem({
        name: 'Poción Roja(XXL)',
        img: '/items/Poción_Roja_(XXL).png',
        maxCantidad: 200,
        effect: [{ bonusRef: 'hp', bonusValue: 3500 }],
        price: 200,
        description: '',
        idItem: IdItem.POCION_ROJA_XXL,
    }),
    createPocionItem({
        name: 'Poción Roja (T)',
        img: '/items/Red_Potion_T.png',
        maxCantidad: 200,
        effect: [{ bonusRef: 'hp', bonusValue: 7000 }],
        price: 350,
        description: '',
        idItem: IdItem.POCION_ROJA_T,
    }),

]