import { EquipType, IdItem } from "netim2-shared";
import { createLegendaryEquipItem } from "src/modules/item/factories/item-builder";


export const ARMADURAS_LEGENDARIAS_LIST: EquipType[] = [
    createLegendaryEquipItem({
        idItem: IdItem.TABULA_RASA,
        name: 'Tabula Rasa',
        lvReq: 1,
        leyenda: "Ninguna espada vence al pecado, guía al pecador hacia la virtud. Revela su visión perdida",
        sub_type_equip: 'armadura',
        especial: false,
        img: '/items/tabula_rasa.png',
        slot: 6,
        size: { rows: 2, cols: 1 },
        price: 10000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.ARMADURA_DEL_CORAZON_DEL_CAOS,
        name: 'Armadura del Corazón del Caos',
        lvReq: 60,
        leyenda: "Nada como la muerte inminente para galvanizar el propósito de la vida.",
        sub_type_equip: 'armadura',
        especial: false,
        img: '/items/corazon_del_caos.png',
        slot: 0,
        size: { rows: 2, cols: 1 },
        price: 10000,
    }),
]