import { createEquipItem } from "../../factories/item-builder";
import { EquipType } from "../../types/entities-props/equip.type";
import { IdItem } from "../../types/iditems/id-item-list.type";

export const BRAZALETE_LIST: EquipType[] = [
    createEquipItem({
    idItem: IdItem.BRAZALETE_DE_MADERA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Madera',
    lvReq: 1,
    img: '/items/Brazalete_de_Madera.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_COBRE,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Cobre',
    lvReq: 8,
    img: '/items/Brazalete_de_Cobre.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_PLATA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Plata',
    lvReq: 15,
    img: '/items/Brazalete_de_Plata.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 1300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_ORO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Oro',
    lvReq: 22,
    img: '/items/Brazalete_de_Oro.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 1800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_JADE,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Jade',
    lvReq: 28,
    img: '/items/Brazalete_de_Jade.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 2300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_EBANO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Ébano',
    lvReq: 33,
    img: '/items/Brazalete_de_Ebano.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 2800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_PERLAS,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Perlas',
    lvReq: 38,
    img: '/items/Brazalete_de_Perlas.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 3300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_ORO_BLANCO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Oro Blanco',
    lvReq: 42,
    img: '/items/Brazalete_de_Oro_Blanco.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 3800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_CRISTAL,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Cristal',
    lvReq: 46,
    img: '/items/Brazalete_de_Cristal.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 4300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_DE_AMATISTA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete de Amatista',
    lvReq: 50,
    img: '/items/Brazalete_de_Amatista.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 4800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.BRAZALETE_LAGR_CIELO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Brazalete Lágr. Cielo',
    lvReq: 54,
    img: '/items/Brazalete_Lágr._Cielo.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'brazalete',
    especial: false,
    price: 5300,
    slot: 0
}),
]