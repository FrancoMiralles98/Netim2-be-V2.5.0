import { IdItem, PocionType } from "netim2-shared";
import { createPocionItem } from "src/modules/item/factories/item-builder";


export const POCION_LIST: PocionType[] = [
    createPocionItem({
        potionType: 'normal',
        name: 'Poción Roja(P)',
        img: '/items/Poción_Roja(P).png',
        maxCantidad: 200,
        effect: [{ resource: 'hp', amount: 300 }, { resource: 'mana', amount: 200 }],
        price: 25,
        description: '',
        idItem: IdItem.POCION_ROJA_P,
    }),
    createPocionItem({
        potionType: 'reserve',
        name: 'Poción Roja(M)',
        reserve: {
            actual: 1000,
            max: 1000
        },
        img: '/items/Poción_Roja(M).png',
        maxCantidad: 200,
        resource: ['hp'],
        price: 50,
        description: '',
        idItem: IdItem.POCION_ROJA_M,
    }),
    createPocionItem({
        potionType: 'normal',
        name: 'Poción Roja(G)',
        img: '/items/Poción_Roja(G).png',
        maxCantidad: 200,
        effect: [{ resource: 'hp', amount: 1500 }],
        price: 100,
        description: '',
        idItem: IdItem.POCION_ROJA_G,
    }),
    createPocionItem({
        potionType: 'normal',
        name: 'Poción Roja(XXL)',
        img: '/items/Poción_Roja_(XXL).png',
        maxCantidad: 200,
        effect: [{ resource: 'hp', amount: 3500 }],
        price: 200,
        description: '',
        idItem: IdItem.POCION_ROJA_XXL,
    }),
    createPocionItem({
        potionType: 'normal',
        name: 'Poción Roja (T)',
        img: '/items/Red_Potion_T.png',
        maxCantidad: 200,
        effect: [{ resource: 'hp', amount: 7000 }],
        price: 350,
        description: '',
        idItem: IdItem.POCION_ROJA_T,
    }),

]