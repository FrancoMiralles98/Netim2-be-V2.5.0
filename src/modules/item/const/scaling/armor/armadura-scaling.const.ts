import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";
import { IdItem } from "../../../types/iditems/id-item-list.type";

export const ARMADURA_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.ROPAJE_AZUL,
            IdItem.ROPAJE_TURQUESA,
            IdItem.ROPAJE_ROSA,
            IdItem.ROPAJE_AMOROSO,
            IdItem.VESTIDO_DIVINO,
            IdItem.ROPAJE_SOLAR,
            IdItem.VESTIDO_MORAL,
            IdItem.VESTIDO_GATO_NARANJA,
            IdItem.VESTIDO_DE_BARONESA,
            IdItem.ROPAJE_NEGRO,
            IdItem.ARMADURA_DE_MONJE,
            IdItem.ARMADURA_PLACAS_DE_HIERRO,
            IdItem.ARMADURA_PLACAS_DE_TIGRE,
            IdItem.ARMADURA_PLACAS_DE_LEON,
            IdItem.ARMADURA_PLACAS_MORTALES,
            IdItem.ARMADURA_PLACAS_DE_DRAGON,
            IdItem.ARMADURA_ESCAMA_AZUL,
            IdItem.ARMADURA_PLACAS_DORADA,
            IdItem.ARMADURA_DIOS_DRAGON,
            IdItem.ARMADURA_ACERO_NEGRO,
            IdItem.TRAJE_AZUL,
            IdItem.TRAJE_DE_MARFIL,
            IdItem.TRAJE_CARMESI,
            IdItem.TRAJE_DE_HORMIGA_ROJA,
            IdItem.TRAJE_DE_HORMIGA_LEON,
            IdItem.TRAJE_DE_ASESINO,
            IdItem.TRAJE_DE_DRAGON_JOVEN,
            IdItem.TRAJE_VIENTO_MATADOR,
            IdItem.TRAJE_FUCSIA,
            IdItem.TRAJE_VIENTO_NEGRO,
            IdItem.ARMADURA_PLACAS_REQUIEM,
            IdItem.ARMADURA_PLACAS_DE_BRUJO,
            IdItem.ARMADURA_DE_DESGRACIA,
            IdItem.ARMADURA_PLACAS_FANTASMA,
            IdItem.ARMADURA_YIN_YANG,
            IdItem.ARMADURA_PLACAS_MISTICA,
            IdItem.ARMADURA_PLACAS_DE_NIEBLA,
            IdItem.ARMADURA_MASCARA_FANTASMA,
            IdItem.ARMADURA_PLACAS_ESPIRITU,
            IdItem.ARMADURA_PLACAS_MAGICA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'def',
                type: 'dinamic',
                type_equip: 'armor',
                type_armor: 'armadura',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.ARMADURA_PLACAS_DE_BRUJO,
            IdItem.ARMADURA_PLACAS_DE_HIERRO,
            IdItem.TRAJE_DE_MARFIL,
            IdItem.ROPAJE_TURQUESA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: -5,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.ROPAJE_ROSA,
            IdItem.ARMADURA_PLACAS_DE_TIGRE,
            IdItem.TRAJE_CARMESI,
            IdItem.ARMADURA_DE_DESGRACIA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 7,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.ROPAJE_AMOROSO,
            IdItem.ARMADURA_PLACAS_DE_LEON,
            IdItem.TRAJE_DE_HORMIGA_ROJA,
            IdItem.ARMADURA_PLACAS_FANTASMA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 10,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.VESTIDO_DIVINO,
            IdItem.ARMADURA_PLACAS_MORTALES,
            IdItem.TRAJE_DE_HORMIGA_LEON,
            IdItem.ARMADURA_YIN_YANG,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 13,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.ROPAJE_SOLAR,
            IdItem.ARMADURA_PLACAS_DE_DRAGON,
            IdItem.TRAJE_DE_ASESINO,
            IdItem.ARMADURA_PLACAS_MISTICA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 16,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.VESTIDO_MORAL,
            IdItem.ARMADURA_ESCAMA_AZUL,
            IdItem.TRAJE_DE_DRAGON_JOVEN,
            IdItem.ARMADURA_PLACAS_DE_NIEBLA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 19,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.VESTIDO_GATO_NARANJA,
            IdItem.ARMADURA_PLACAS_DORADA,
            IdItem.TRAJE_VIENTO_MATADOR,
            IdItem.ARMADURA_MASCARA_FANTASMA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 22,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.VESTIDO_DE_BARONESA,
            IdItem.ARMADURA_DIOS_DRAGON,
            IdItem.TRAJE_FUCSIA,
            IdItem.ARMADURA_PLACAS_ESPIRITU,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'static',
                value: 26,
                sign: 'negative',
                origin: 'configured'
            }
        ]
    },
    {
        idItems: [
            IdItem.ROPAJE_NEGRO,
            IdItem.ARMADURA_ACERO_NEGRO,
            IdItem.TRAJE_VIENTO_NEGRO,
            IdItem.ARMADURA_PLACAS_MAGICA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                type: 'plane',
                patternScale: 'descending_scale_from_30',
                origin: 'configured'
            }
        ]
    }
]