import { createEquipItem } from "src/modules/item/factories/item-builder";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const ARMADURA_LIST: EquipType[] = [
    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_REQUIEM,
        restricted: ["sura"],
        name: 'Armadura Placas Réquiem',
        lvReq: 1,
        img: '/items/Arm._Placas_Réquiem.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 1000,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_DE_BRUJO,
        restricted: ["sura"],
        name: 'Armadura Placas de Brujo',
        lvReq: 9,
        img: '/items/Arm._Placas_de_Brujo.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 1500,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_DE_DESGRACIA,
        restricted: ["sura"],
        name: 'Armadura de Desgracia',
        lvReq: 18,
        img: '/items/Armadura_de_Desgracia.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 2000,
        slot: 1
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_FANTASMA,
        restricted: ["sura"],
        name: 'Armadura Placas Fantasma',
        lvReq: 26,
        img: '/items/Arm._Placas_Fantasma.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 3000,
        slot: 2
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_YIN_YANG,
        restricted: ["sura"],
        name: 'Armadura Yin-Yang',
        lvReq: 34,
        img: '/items/Armadura_Yin-Yang.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 4500,
        slot: 2
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_MISTICA,
        restricted: ["sura"],
        name: 'Armadura Placas Mística',
        lvReq: 42,
        img: '/items/Arm._Placas_Mística.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 5500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_DE_NIEBLA,
        restricted: ["sura"],
        name: 'Armadura Placas de Niebla',
        lvReq: 48,
        img: '/items/Arm._Placas_de_Niebla.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 6500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_MASCARA_FANTASMA,
        restricted: ["sura"],
        name: 'Armadura Máscara Fantasma',
        lvReq: 54,
        img: '/items/Arm._Máscara_Fantasma.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 7500,
        slot: 3
    }),

    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_ESPIRITU,
        restricted: ["sura"],
        name: 'Armadura Placas Espiritu',
        lvReq: 61,
        img: '/items/Arm._Placas_Espiritu.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 8000,
        slot: 3
    }),
    createEquipItem({
        idItem: IdItem.ARMADURA_PLACAS_MAGICA,
        restricted: ["sura"],
        name: 'Armadura Placas Mágica',
        lvReq: 68,
        img: '/items/Arm._Placas_Mágica.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'armadura',
        especial: false,
        price: 8500,
        slot: 3
    }),
]