import { IdItem, MonturaType } from "netim2-shared";
import { createMonturaItem } from "src/modules/item/factories/item-builder";


export const LICENCIA_MONTURA_LIST: MonturaType[] = [
    createMonturaItem({
        name: 'Licencia de Caballo',
        description: 'Con esta licencia podras llamar a tu Caballo.',
        img: '/itemsUtility/montura/Licencia_Caballo.png',
        idItem: IdItem.LICENCIA_DE_CABALLO,
        lvUtility: 20,
        monturaLv: 1,
        price: 1000,
        special_montura: false,
    }),
    createMonturaItem({
        name: 'Licencia de Caballo Armado',
        description: 'Con esta licencia podras llamar a tu Caballo Armado.',
        img: '/itemsUtility/montura/Licencia_Caballo_Armado.png',
        idItem: IdItem.LICENCIA_DE_CABALLO_ARMADO,
        lvUtility: 40,
        monturaLv: 2,
        price: 1500,
        special_montura: false,
    }),
    createMonturaItem({
        name: 'Licencia de Caballo Militar',
        description: 'Con esta licencia podras llamar a tu Caballo Militar.',
        img: '/itemsUtility/montura/Licencia_Caballo_Militar.png',
        idItem: IdItem.LICENCIA_DE_CABALLO_MILITAR,
        lvUtility: 60,
        monturaLv: 3,
        price: 2000,
        special_montura: false,
    }),
    createMonturaItem({
        name: 'Sello de Caballo Fantasma',
        description: 'Con este sello podras llamar a tu Caballo Fantasma.',
        img: '/itemsUtility/montura/Sello_de_Caballo_Fantasma.png',
        idItem: IdItem.SELLO_DE_CABALLO_FANTASMA,
        lvUtility: 1,
        monturaLv: 0,
        price: 2000,
        special_montura: false,
    }),
]