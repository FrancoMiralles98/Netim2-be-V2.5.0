import { createEquipItem } from "../../factories/item-builder";
import { EquipType } from "../../types/entities-props/equip.type";
import { IdItem } from "../../types/iditems/id-item-list.type";

export const CHAMAN_HELMET: EquipType[] = [
    createEquipItem({
        idItem: IdItem.SOMBRERO_DE_MONJE,
        restricted: ["chaman"],
        name: 'Sombrero de Monje',
        lvReq: 1,
        img: '/items/Sombrero_de_Monje.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'casco',
        especial: false,
        price: 300,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.SOMBRERO_FENIX,
        restricted: ["chaman"],
        name: 'Sombrero Fénix',
        lvReq: 21,
        img: '/items/Sombrero_Fénix.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'casco',
        especial: false,
        price: 2500,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.SOMBRERO_LUZ_DEL_SOL,
        restricted: ["chaman"],
        name: 'Sombrero Luz del Sol',
        lvReq: 41,
        img: '/items/Sombrero_Luz_del_Sol.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'casco',
        especial: false,
        price: 5000,
        slot: 0
    }),

    createEquipItem({
        idItem: IdItem.SOMBRERO_DE_CARDENAL,
        restricted: ["chaman"],
        name: 'Sombrero de Cardenal',
        lvReq: 60,
        img: '/items/Sombrero_de_Cardenal.png',
        size: { rows: 1, cols: 1 },
        sub_type_equip: 'casco',
        especial: false,
        price: 7000,
        slot: 0
    }),
    createEquipItem({
    idItem: IdItem.CASCO_TRADICIONAL,
    restricted: ["guerrero"],
    name: 'Casco Tradicional',
    lvReq: 1,
    img: '/items/Casco_tradicional.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.CASCO_DE_HIERRO,
    restricted: ["guerrero"],
    name: 'Casco de Hierro',
    lvReq: 21,
    img: '/items/Casco_de_hierro.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 2500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.SALLET_MASCARA_FANT,
    restricted: ["guerrero"],
    name: 'Sallet Máscara Fant.',
    lvReq: 41,
    img: '/items/Sallet_mascara_fant.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 5000,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.MASCARA_TERRORIFICA,
    restricted: ["guerrero"],
    name: 'Máscara Terrorífica',
    lvReq: 60,
    img: '/items/Mascara_terrorifica.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 7000,
    slot: 0
}),
createEquipItem({
    idItem: IdItem.CAPUCHA_DE_CUERO,
    restricted: ["ninja"],
    name: 'Capucha de Cuero',
    lvReq: 1,
    img: '/items/Capucha_de_Cuero.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.CAPUCHA_DE_CADENA,
    restricted: ["ninja"],
    name: 'Capucha de Cadena',
    lvReq: 21,
    img: '/items/Capucha_de_Cadena.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 2500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.CAPUCHA_DE_ACERO,
    restricted: ["ninja"],
    name: 'Capucha de Acero',
    lvReq: 41,
    img: '/items/Capucha_de_Acero.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 5000,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.CAPUCHA_DE_ORCO,
    restricted: ["ninja"],
    name: 'Capucha de Orco',
    lvReq: 60,
    img: '/items/CascoNLogo.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 7000,
    slot: 0
}),
createEquipItem({
    idItem: IdItem.YELMO_SANGRIENTO,
    restricted: ["sura"],
    name: 'Yelmo Sangriento',
    lvReq: 1,
    img: '/items/Yelmo_Sangriento.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 300,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.YELMO_BURLON,
    restricted: ["sura"],
    name: 'Yelmo Burlón',
    lvReq: 21,
    img: '/items/Yelmo_Burlón.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 2500,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.YELMO_CASTILLO,
    restricted: ["sura"],
    name: 'Yelmo Castillo',
    lvReq: 41,
    img: '/items/Yelmo_Castillo.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 5000,
    slot: 0
}),

createEquipItem({
    idItem: IdItem.CASCO_CON_CUERNOS,
    restricted: ["sura"],
    name: 'Casco con Cuernos',
    lvReq: 60,
    img: '/items/Casco_con_Cuernos.png',
    size: { rows: 1, cols: 1 },
    sub_type_equip: 'casco',
    especial: false,
    price: 7500,
    slot: 0
}),
]