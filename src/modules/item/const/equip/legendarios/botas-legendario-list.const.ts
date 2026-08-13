import { EquipType, IdItem } from "netim2-shared";
import { createLegendaryEquipItem } from "src/modules/item/factories/item-builder";


export const BOTAS_LEGENDARIO_LIST: EquipType[] = [
    createLegendaryEquipItem({
        idItem: IdItem.BOTAS_DEL_IMPULSO_DE_LA_PESADILLA,
        name: 'Botas del Impulso de la Pesadilla',
        lvReq: 60,
        leyenda: "Conviértete en uno con la llama imparable.",
        sub_type_equip: 'botas',
        especial: false,
        img: '/items/impulso_de_la_pandilla.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 60000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.BOTAS_DE_ESCAMAS_DE_DRAGON,
        name: 'Botas de Escamas de Dragón',
        lvReq: 20,
        leyenda: "Al huir de la muerte, puedes olvidarte de vivir.",
        sub_type_equip: 'botas',
        especial: false,
        img: '/items/botas_escamas_dragon.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 20000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.BOTAS_DE_CONJURADOR,
        name: 'Botas de Conjurador',
        lvReq: 40,
        leyenda: "Luchar contra un enemigo en sus tierras es un error táctico. Haz tuyas esas tierras y el error será suyo.",
        sub_type_equip: 'botas',
        especial: false,
        img: '/items/botas_conjurador.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 40000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.BOTAS_DEL_CAOS,
        name: 'Botas del Caos',
        lvReq: 60,
        leyenda: "No te inmutes. Es una pérdida de tiempo para atacar.",
        sub_type_equip: 'botas',
        especial: false,
        img: '/items/botas_caos.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 60000,
    }),
]