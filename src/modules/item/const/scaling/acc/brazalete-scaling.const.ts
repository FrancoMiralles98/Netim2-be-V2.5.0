import { IdItem } from "netim2-shared";
import { CoreImplicitItem } from "src/modules/item/types/const/scaling/core-equip-item.type";

export const BRAZALETE_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.BRAZALETE_DE_MADERA,
            IdItem.BRAZALETE_DE_COBRE,
            IdItem.BRAZALETE_DE_PLATA
        ],
        implicitBonus: [
            {
                bonusRefKey: 'va',
                type: 'plane',
                origin: 'configured',
                patternScale: 'scale_to_10'
            }
        ]
    },
    {
        idItems: [
            IdItem.BRAZALETE_DE_ORO,
            IdItem.BRAZALETE_DE_JADE,
            IdItem.BRAZALETE_DE_EBANO
        ],
        implicitBonus: [
            {
                bonusRefKey: 'va',
                type: 'plane',
                origin: 'configured',
                patternScale: 'scale_to_12'
            }
        ]
    },
    {
        idItems: [
            IdItem.BRAZALETE_DE_PERLAS,
            IdItem.BRAZALETE_DE_ORO_BLANCO,
            IdItem.BRAZALETE_DE_CRISTAL,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'va',
                type: 'plane',
                origin: 'configured',
                patternScale: 'scale_to_15'
            }
        ]
    },
    {
        idItems: [
            IdItem.BRAZALETE_DE_AMATISTA,
            IdItem.BRAZALETE_LAGR_CIELO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'va',
                type: 'plane',
                origin: 'configured',
                patternScale: 'scale_to_20'
            }
        ]
    },
    {
        idItems: [IdItem.BRAZALETE_DE_COBRE],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_PLATA],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_ORO],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_JADE],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_EBANO],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_PERLAS],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_ORO_BLANCO],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_CRISTAL],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_DE_AMATISTA],
        implicitBonus: []
    },
    {
        idItems: [IdItem.BRAZALETE_LAGR_CIELO],
        implicitBonus: []
    },
]