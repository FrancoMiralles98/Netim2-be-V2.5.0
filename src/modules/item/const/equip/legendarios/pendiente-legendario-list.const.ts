import { createLegendaryEquipItem } from "src/modules/item/factories/item-builder";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const PENDIENTE_LEGENDARIO_LIST: EquipType[] = [
    createLegendaryEquipItem({
        idItem: IdItem.PENDIENTE_DE_AMBAR,
        name: 'Pendiente de Ambar',
        lvReq: 20,
        leyenda: "En mi sueño, una voz me habló. Dijo: «Mi alcance no conoce límites.Todo lo puro está destinado a pudrirse».",
        sub_type_equip: 'pendiente',
        especial: false,
        img: '/items/pendiente_ambar.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 20000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.PENDIENTE_DE_ESMERALDA,
        name: 'Pendiente de Esmeralda',
        lvReq: 20,
        leyenda: "Esperamos, inmóviles como los muertos. Para unirnos a la gran avalancha.",
        sub_type_equip: 'pendiente',
        especial: false,
        img: '/items/pendiente_jade.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 20000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.PENDIENTE_DE_LAPISLAZULI,
        name: 'Pendiente de Lapislázuli',
        lvReq: 20,
        leyenda: "Un símbolo brillante de Pureza, claro como el agua, pero sé mejor que nadie lo rápido quela Pureza puede sucumbir a la Corrupción.",
        sub_type_equip: 'pendiente',
        especial: false,
        img: '/items/pendiente_lapis.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 20000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.CORO_DE_LA_TORMENTA,
         name: 'Coro de la Tormenta',
        lvReq: 60,
        leyenda: "Que los impenitentes sean arrastrados siempre hacia abajo por el peso de sus pecados.",
        sub_type_equip: 'pendiente',
        especial: false,
        img: '/items/coro_de_la_tormenta.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 60000,
    }),
]