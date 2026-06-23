import { createLegendaryEquipItem } from "src/modules/item/factories/item-builder";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const CASCO_LEGENDARIAS_LIST: EquipType[] = [
    createLegendaryEquipItem({
        idItem: IdItem.CASCO_NIDO_DE_RATAS,
        name: 'Casco Nido de Ratas',
        lvReq: 20,
        leyenda: "Que nunca oigas el tañido.",
        sub_type_equip: 'casco',
        especial: false,
        img: '/items/nido_de_ratas.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 20000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.DIADEMA_DE_NIGROMANTE_DE_TOXINAS,
        name: 'Diadema de Nigromante de Toxinas',
        lvReq: 60,
        leyenda: "Un cazador usa todo lo que tiene a su disposición.",
        sub_type_equip: 'casco',
        especial: false,
        img: '/items/diadema_de_nigromante.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 60000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.CASCO_AULLIDO_DE_ALPHA,
        name: 'Casco Aullido de Alpha',
        lvReq: 20,
        leyenda: "La naturaleza respeta a los fuertes y pinta la nieve de rojo con la sangre de los débiles.",
        sub_type_equip: 'casco',
        especial: false,
        img: '/items/aullido_de_Alpha.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 20000,
    }),
    createLegendaryEquipItem({
        idItem: IdItem.ABYSSUS,
        name: 'Abyssus',
        lvReq: 40,
        leyenda: "Cuando hayas matado a todos tus enemigos, ¿qué te queda por temer?",
        sub_type_equip: 'casco',
        especial: false,
        img: '/items/abyssus.png',
        slot: 0,
        size: { rows: 1, cols: 1 },
        price: 40000,
    }),
]