import { EquipType, IdItem } from "netim2-shared";
import { createEquipItem } from "../../factories/item-builder";


export const PENDIENTE_LIST: EquipType[] = [
    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_MADERA,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Madera',
        lvReq: 1,
        img: '/items/Pendientes_de_Madera.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_COBRE,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Cobre',
        lvReq: 8,
        img: '/items/Pendientes_de_Cobre.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_PLATA,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Plata',
        lvReq: 15,
        img: '/items/Pendientes_de_Plata.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 1300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_ORO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Oro',
        lvReq: 22,
        img: '/items/Pendientes_de_Oro.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 1800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTE_DE_JADE,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendiente de Jade',
        lvReq: 28,
        img: '/items/Pendiente_de_Jade.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 2300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_EBANO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Ébano',
        lvReq: 33,
        img: '/items/Pendientes_de_Ébano.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 2800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_PERLAS,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Perlas',
        lvReq: 38,
        img: '/items/Pendientes_de_perlas.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 3300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_ORO_BLANCO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Oro Blanco',
        lvReq: 42,
        img: '/items/Pendientes_de_Oro_Blanco.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 3800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_CRISTAL,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Cristal',
        lvReq: 46,
        img: '/items/Pendientes_de_Cristal.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 4300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_DE_AMATISTA,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes de Amatista',
        lvReq: 50,
        img: '/items/Pendientes_de_Amatista.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 4800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.PENDIENTES_LAGR_CIELO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Pendientes Lágr. Cielo',
        lvReq: 54,
        img: '/items/Pendientes_Lágr._Cielo.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'pendiente',
        especial: false,
        price: 5300,
        slot: 0
    }),
]