import { IdItem, ItemDTO } from "netim2-shared";
import { createEquipItem } from "../factories/item-builder";


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