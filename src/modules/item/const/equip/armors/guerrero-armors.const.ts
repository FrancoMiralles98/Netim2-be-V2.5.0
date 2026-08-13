import { EquipType, IdItem } from "netim2-shared";
import { createEquipItem } from "src/modules/item/factories/item-builder";


export const GUERRERO_ARMORS: EquipType[] = [
    createEquipItem({
    idItem: IdItem.ARMADURA_DE_MONJE,
    restricted: ["guerrero"],
    name: 'Armadura de Monje',
    lvReq: 1,
    img: '/items/Armadura_de_Monje.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 1000,
    slot: 1
}),

createEquipItem({
    idItem: IdItem.ARMADURA_PLACAS_DE_HIERRO,
    restricted: ["guerrero"],
    name: 'Armadura Placas de Hierro',
    lvReq: 9,
    img: '/items/Armadura_Placas_de_Hierro.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 1500,
    slot: 1
}),

createEquipItem({
    idItem: IdItem.ARMADURA_PLACAS_DE_TIGRE,
    restricted: ["guerrero"],
    name: 'Armadura Placas de Tigre',
    lvReq: 18,
    img: '/items/Arm._Placas_de_Tigre.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 2000,
    slot: 1
}),

createEquipItem({
    idItem: IdItem.ARMADURA_PLACAS_DE_LEON,
    restricted: ["guerrero"],
    name: 'Armadura Placas de León',
    lvReq: 26,
    img: '/items/Arm._Placas_de_León.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 3000,
    slot: 2
}),

createEquipItem({
    idItem: IdItem.ARMADURA_PLACAS_MORTALES,
    restricted: ["guerrero"],
    name: 'Armadura Placas Mortales',
    lvReq: 34,
    img: '/items/Arm._Placas_Mortales.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 4500,
    slot: 2
}),

createEquipItem({
    idItem: IdItem.ARMADURA_PLACAS_DE_DRAGON,
    restricted: ["guerrero"],
    name: 'Armadura Placas de Dragón',
    lvReq: 42,
    img: '/items/Arm._Placas_de_Dragón.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 5500,
    slot: 3
}),

createEquipItem({
    idItem: IdItem.ARMADURA_ESCAMA_AZUL,
    restricted: ["guerrero"],
    name: 'Armadura Escama Azul',
    lvReq: 48,
    img: '/items/Arm._Escama_Azul.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 6500,
    slot: 3
}),

createEquipItem({
    idItem: IdItem.ARMADURA_PLACAS_DORADA,
    restricted: ["guerrero"],
    name: 'Armadura Placas Dorada',
    lvReq: 54,
    img: '/items/Arm._Placas_Dorada.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 7500,
    slot: 3
}),

createEquipItem({
    idItem: IdItem.ARMADURA_DIOS_DRAGON,
    restricted: ["guerrero"],
    name: 'Armadura Dios Dragón',
    lvReq: 61,
    img: '/items/Arm._Dios_Dragón.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 8200,
    slot: 3
}),

createEquipItem({
    idItem: IdItem.ARMADURA_ACERO_NEGRO,
    restricted: ["guerrero"],
    name: 'Armadura Acero Negro',
    lvReq: 68,
    img: '/items/Arm._Acero_Negro.png',
    size: { rows: 2, cols: 1 },
    sub_type_equip: 'armadura',
    especial: false,
    price: 8500,
    slot: 3
}),
]