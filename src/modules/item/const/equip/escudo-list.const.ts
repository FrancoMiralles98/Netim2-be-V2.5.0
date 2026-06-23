import { createEquipItem } from "../../factories/item-builder";
import { EquipType } from "../../types/entities-props/equip.type";
import { IdItem } from "../../types/iditems/id-item-list.type";

export const ESCUDO_LIST: EquipType[] = [
    createEquipItem({
    idItem: IdItem.ESCUDO_DE_BATALLA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo de Batalla',
    lvReq: 1,
    img: '/items/Escudo_de_Batalla.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.ESCUDO_PENTAGONO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo Pentagono',
    lvReq: 21,
    img: '/items/Escudo_Pentagono.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 2500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.ESCUDO_NEGRO_REDONDO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo Negro Redondo',
    lvReq: 41,
    img: '/items/Escudo_Negro_Redondo.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 5000,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.ESCUDO_HALCON,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo Halcón',
    lvReq: 61,
    img: '/items/Escudo_Halcón.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 7500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.ESCUDO_LIMITE_LEON,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo Límite León',
    lvReq: 61,
    img: '/items/Escudo_Límite_León.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 7500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.ESCUDO_TIGRE,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo Tigre',
    lvReq: 61,
    img: '/items/Escudo_Tigre.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 7500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.ESCUDO_ESCAMA_DRAGON,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Escudo Escama Dragón',
    lvReq: 61,
    img: '/items/Escudo_Escama_Dragón.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'escudo',
    especial: false,
    price: 7500,
    slot: 0
}),
]