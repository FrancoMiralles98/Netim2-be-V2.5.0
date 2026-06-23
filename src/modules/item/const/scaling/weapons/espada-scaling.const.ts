import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";
import { IdItem } from "../../../types/iditems/id-item-list.type";

export const ESPADA_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.ESPADA,
            IdItem.ESPADA_LARGA,
            IdItem.ESPADA_CRECIENTE,
            IdItem.ESPADA_DE_BAMBU,
            IdItem.ESPADA_ANCHA,
            IdItem.ESPADA_DE_PLATA,
            IdItem.ESPADA_LUNA_LLENA,
            IdItem.ESPADA_ORQUIDEA,
            IdItem.ESPADA_BASTARDA,
            IdItem.ESPADA_BARBARA,
            IdItem.ESPADA_SANGRIENTA,
            IdItem.GRAN_ESPADA,
            IdItem.ESPADA_BRUJO_VOLADOR,
            IdItem.ESPADA_MEDIA_LUNA,
            IdItem.ESPADA_NINFA,
            IdItem.ESPADA_DE_BATALLA,
            IdItem.ESPADA_PICADURA,
            IdItem.ESPADA_ENVENENADA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'espada',
                origin: 'configured',
            },
            {
                bonusRefKey: 'ap',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'espada',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_15',
                origin: 'configured'
            },
        ]
    },
    {
        idItems: [
            IdItem.ESPADA_EXORCISMO,
            IdItem.HOJA_COLMILLO_FANTASMA,
            IdItem.ESPADA_DEMONIO,
            IdItem.ESPADA_LEON,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'specific',
                origin: 'configured',
            },
            {
                bonusRefKey: 'ap',
                type: 'specific',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_20',
                origin: 'configured'
            },
        ]
    },
]