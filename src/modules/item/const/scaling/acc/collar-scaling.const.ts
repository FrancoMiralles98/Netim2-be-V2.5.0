import { CoreImplicitItem } from "src/modules/item/types/const/scaling/core-equip-item.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const COLLAR_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.COLLAR_DE_MADERA,
            IdItem.COLLAR_DE_COBRE,
            IdItem.COLLAR_DE_PLATA,

        ],
        implicitBonus: [
            {
                bonusRefKey: 'vh',
                type: 'plane',
                patternScale: 'scale_to_7',
                origin: 'configured',
            }
        ]
    },
    {
        idItems: [
            IdItem.COLLAR_DE_ORO,
            IdItem.COLLAR_DE_JADE,
            IdItem.COLLAR_DE_EBANO,

        ],
        implicitBonus: [
            {
                bonusRefKey: 'vh',
                type: 'plane',
                patternScale: 'scale_to_10',
                origin: 'configured',
            }
        ]
    },
    {
        idItems: [
            IdItem.COLLAR_DE_PERLAS,
            IdItem.COLLAR_DE_ORO_BLANCO,
            IdItem.COLLAR_DE_CRISTAL,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vh',
                type: 'plane',
                patternScale: 'scale_to_12',
                origin: 'configured',
            }
        ]
    },
    {
        idItems: [
            IdItem.COLLAR_DE_AMATISTA,
            IdItem.COLLAR_LAGR_DE_CIELO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vh',
                type: 'plane',
                patternScale: 'scale_to_15',
                origin: 'configured',
            }
        ]
    },
    {
        idItems: [IdItem.COLLAR_DE_MADERA],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_COBRE],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_PLATA],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_ORO],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_JADE],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_EBANO],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_PERLAS],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_ORO_BLANCO],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_CRISTAL],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_DE_AMATISTA],
        implicitBonus: []
    },
    {
        idItems: [IdItem.COLLAR_LAGR_DE_CIELO],
        implicitBonus: []
    },
]