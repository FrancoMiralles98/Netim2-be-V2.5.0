import { IdItem } from "netim2-shared";
import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";

export const ESCUDO_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.ESCUDO_DE_BATALLA,
            IdItem.ESCUDO_PENTAGONO,
            IdItem.ESCUDO_NEGRO_REDONDO,
            IdItem.ESCUDO_HALCON,
            IdItem.ESCUDO_LIMITE_LEON,
            IdItem.ESCUDO_TIGRE,
            IdItem.ESCUDO_ESCAMA_DRAGON,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'def',
                type: 'dinamic',
                type_equip: 'armor',
                type_armor: 'escudo',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [IdItem.ESCUDO_DE_BATALLA,],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 5,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [IdItem.ESCUDO_PENTAGONO,],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 9,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [IdItem.ESCUDO_NEGRO_REDONDO,],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 14,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.ESCUDO_HALCON,
            IdItem.ESCUDO_LIMITE_LEON,
            IdItem.ESCUDO_TIGRE,
            IdItem.ESCUDO_ESCAMA_DRAGON,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 20,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    }
]