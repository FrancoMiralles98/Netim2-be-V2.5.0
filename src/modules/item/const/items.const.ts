import { createEquipItem } from "../factories/item-builder";
import { IdItem } from "../types/iditems/id-item-list.type";
import { ItemDTO } from "../types/item-dto";

export const ITEM_LIST: ItemDTO[] = [
    createEquipItem({
        idItem: IdItem.ESPADA,
        restricted: ['guerrero', 'ninja', 'sura'],
        name: "Espada",
        lvReq: 1,
        img: '/items/Icono_Espada.png',
        size: { rows: 2, cols: 1 },
        sub_type_equip: 'arma',
        type_weapon: 'espada',
        especial: false,
        price: 300,
        slot: 1
    }),
]