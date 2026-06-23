import { createEquipItem } from "src/modules/item/factories/item-builder";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const CHAMAN_ARMORS: EquipType[] = [
    createEquipItem({
        idItem: IdItem.ROPAJE_AZUL,
        restricted: ["chaman"],
        name: 'Ropaje Azul',
        lvReq: 1,
        img: '/items/Ropaje_Azul.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 1000,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.ROPAJE_TURQUESA,
        restricted: ["chaman"],
        name: 'Ropaje Turquesa',
        lvReq: 9,
        img: '/items/Ropaje_Turquesa.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 1500,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.ROPAJE_ROSA,
        restricted: ["chaman"],
        name: 'Ropaje Rosa',
        lvReq: 18,
        img: '/items/Ropaje_Rosa.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 2000,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.ROPAJE_AMOROSO,
        restricted: ["chaman"],
        name: 'Ropaje Amoroso',
        lvReq: 26,
        img: '/items/Ropaje_Amoroso.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 3000,
        slot: 2
    }),

    createEquipItem({
        idItem: IdItem.VESTIDO_DIVINO,
        restricted: ["chaman"],
        name: 'Vestido Divino',
        lvReq: 34,
        img: '/items/Vestido_Divino.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 4500,
        slot: 2
    }),

    createEquipItem({
        idItem: IdItem.ROPAJE_SOLAR,
        restricted: ["chaman"],
        name: 'Ropaje Solar',
        lvReq: 42,
        img: '/items/Ropaje_Solar.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 5500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.VESTIDO_MORAL,
        restricted: ["chaman"],
        name: 'Vestido Moral',
        lvReq: 48,
        img: '/items/Vestido_Moral.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 6500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.VESTIDO_GATO_NARANJA,
        restricted: ["chaman"],
        name: 'Vestido Gato Naranja',
        lvReq: 54,
        img: '/items/Vestido_Gato_Naranja.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 7500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.VESTIDO_DE_BARONESA,
        restricted: ["chaman"],
        name: 'Vestido de Baronesa',
        lvReq: 61,
        img: '/items/Vestido_de_Baronesa.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 8000,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.ROPAJE_NEGRO,
        restricted: ["chaman"],
        name: 'Ropaje Negro',
        lvReq: 68,
        img: '/items/Ropaje_Negro.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 8500,
        slot: 3
    }),
]