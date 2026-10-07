import { EquipType, IdItem } from "netim2-shared";
import { createEquipItem } from "src/modules/item/factories/item-builder";


export const NINJA_ARMORS: EquipType[] = [
    createEquipItem({
        idItem: IdItem.TRAJE_AZUL,
        restricted: ["ninja"],
        name: 'Traje Azul',
        lvReq: 1,
        img: '/items/Traje_Azul.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 1000,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_DE_MARFIL,
        restricted: ["ninja"],
        name: 'Traje de Marfil',
        lvReq: 9,
        img: '/items/Traje_de_Marfil.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 1500,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_CARMESI,
        restricted: ["ninja"],
        name: 'Traje Carmesí',
        lvReq: 18,
        img: '/items/Traje_Carmesí.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 2000,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_DE_HORMIGA_ROJA,
        restricted: ["ninja"],
        name: 'Traje de Hormiga Roja',
        lvReq: 26,
        img: '/items/Traje_de_Hormiga_Roja.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 3000,
        slot: 2
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_DE_HORMIGA_LEON,
        restricted: ["ninja"],
        name: 'Traje de Hormiga León',
        lvReq: 34,
        img: '/items/Traje_de_Hormiga_León.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 4500,
        slot: 2
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_DE_ASESINO,
        restricted: ["ninja"],
        name: 'Traje de Asesino',
        lvReq: 42,
        img: '/items/Traje_de_Asesino.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 5500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_DE_DRAGON_JOVEN,
        restricted: ["ninja"],
        name: 'Traje de Dragón Joven',
        lvReq: 48,
        img: '/items/Traje_de_Dragón_Joven.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 6500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_VIENTO_MATADOR,
        restricted: ["ninja"],
        name: 'Traje Viento Matador',
        lvReq: 54,
        img: '/items/Traje_Viento_Matador.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 7500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_FUCSIA,
        restricted: ["ninja"],
        name: 'Traje Fucsia',
        lvReq: 61,
        img: '/items/Traje_Fucsia.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 8000,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.TRAJE_VIENTO_NEGRO,
        restricted: ["ninja"],
        name: 'Traje Viento Negro',
        lvReq: 68,
        img: '/items/Traje_Viento_Negro.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 8500,
        slot: 3
    }),
]
