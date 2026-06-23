import { createEquipItem } from "../../factories/item-builder";
import { EquipType } from "../../types/entities-props/equip.type";
import { IdItem } from "../../types/iditems/id-item-list.type";

export const COLLAR_LIST: EquipType[] = [
    createEquipItem({
    idItem: IdItem.COLLAR_DE_MADERA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Madera',
    lvReq: 1,
    img: '/items/Collar_de_Madera.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_COBRE,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Cobre',
    lvReq: 8,
    img: '/items/Collar_de_cobre.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_PLATA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Plata',
    lvReq: 15,
    img: '/items/Collar_de_plata.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 1300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_ORO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Oro',
    lvReq: 22,
    img: '/items/Collar_de_oro.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 1800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_JADE,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Jade',
    lvReq: 28,
    img: '/items/Collar_de_Jade.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 2300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_EBANO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de ébano',
    lvReq: 33,
    img: '/items/Collar_de_Ébano.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 2800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_PERLAS,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Perlas',
    lvReq: 38,
    img: '/items/Collar_de_perlas.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 3300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_ORO_BLANCO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Oro Blanco',
    lvReq: 42,
    img: '/items/Collar_de_Oro_Blanco.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 3800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_CRISTAL,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Cristal',
    lvReq: 46,
    img: '/items/Collar_de_Cristal.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 4300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_DE_AMATISTA,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar de Amatista',
    lvReq: 50,
    img: '/items/Collar_de_Amatista.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 4800,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.COLLAR_LAGR_DE_CIELO,
    restricted: ["guerrero","ninja","sura","chaman"],
    name: 'Collar Lágr. de Cielo',
    lvReq: 54,
    img: '/items/Collar_Lagr._de_Cielo.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'collar',
    especial: false,
    price: 5300,
    slot: 0,
})
]