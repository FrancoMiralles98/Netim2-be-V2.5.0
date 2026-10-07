import { EquipType, IdItem } from "netim2-shared";
import { createEquipItem } from "../../factories/item-builder";


export const BOTAS_LIST: EquipType[] = [
    createEquipItem({
        idItem: IdItem.ZAPATILLAS_DE_CUERO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatillas de cuero',
        lvReq: 1,
        img: '/items/Zapatillas_de_cuero.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_CORTEZA_DE_BAMBU,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos Corteza de Bambú',
        lvReq: 8,
        img: '/items/Zapatos_Corteza_de_Bambú.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_DE_MADERA,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos de Madera',
        lvReq: 15,
        img: '/items/Zapatos_de_Madera.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 1300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_ADORNO_DE_ORO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos Adorno de Oro',
        lvReq: 22,
        img: '/items/Zapatos_Adorno_de_Oro.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 1800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.BOTAS_DE_CUERO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Botas de Cuero',
        lvReq: 28,
        img: '/items/Botas_de_Cuero.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 2300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_DORADOS,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos Dorados',
        lvReq: 33,
        img: '/items/Zapatos_Dorados.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 2800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.BOTAS_DE_BRONCE,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Botas de Bronce',
        lvReq: 38,
        img: '/items/Botas_de_Bronce.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 3300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_DE_JADE,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos de Jade',
        lvReq: 42,
        img: '/items/Zapatos_de_Jade.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 3800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_DE_EXTASIS,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos de Éxtasis',
        lvReq: 46,
        img: '/items/Zapatos_Éxtasis.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 4300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.BOTAS_DE_NIMBO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Botas de Nimbo',
        lvReq: 51,
        img: '/items/Botas_de_Nimbo.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 4800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_DE_FENIX,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos de Fénix',
        lvReq: 55,
        img: '/items/Zapatos_de_Fénix.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 5300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_PAJARO_FUEGO,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos Pájaro Fuego',
        lvReq: 59,
        img: '/items/Zapatos_Pájaro_Fuego.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 5800,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_DE_LA_EUFORIA,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos de la Euforia',
        lvReq: 65,
        img: '/items/Zapatos_de_la_Euforia.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 6300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.BOTAS_DE_GLORIA,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Botas de Gloria',
        lvReq: 65,
        img: '/items/Botas_de_Gloria.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 6300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.ZAPATOS_PIRICOS,
        restricted: ["guerrero", "ninja", "sura", "chaman"],
        name: 'Zapatos píricos',
        lvReq: 75,
        img: '/items/Zapatos_píricos.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'botas',
        especial: false,
        price: 6800,
        slot: 0
    }),
]