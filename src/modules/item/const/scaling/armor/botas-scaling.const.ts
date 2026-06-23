import { CoreImplicitItem } from "src/modules/item/types/const/scaling/core-equip-item.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const BOTAS_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.ZAPATILLAS_DE_CUERO,
            IdItem.ZAPATOS_CORTEZA_DE_BAMBU,
            IdItem.ZAPATOS_DE_MADERA,
            IdItem.ZAPATOS_ADORNO_DE_ORO,
            IdItem.BOTAS_DE_CUERO,
            IdItem.ZAPATOS_DORADOS,
            IdItem.BOTAS_DE_BRONCE,
            IdItem.ZAPATOS_DE_JADE,
            IdItem.ZAPATOS_DE_EXTASIS,
            IdItem.BOTAS_DE_NIMBO,
            IdItem.ZAPATOS_DE_FENIX,
            IdItem.ZAPATOS_PAJARO_FUEGO,
            IdItem.ZAPATOS_DE_LA_EUFORIA,
            IdItem.BOTAS_DE_GLORIA,
            IdItem.ZAPATOS_PIRICOS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'def',
                origin: 'configured',
                type: 'dinamic',
                type_equip: 'armor',
                type_armor: 'botas'
            }
        ]
    },
    {
        idItems: [
            IdItem.ZAPATILLAS_DE_CUERO,
            IdItem.ZAPATOS_CORTEZA_DE_BAMBU,
            IdItem.ZAPATOS_DE_MADERA,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'plane',
                patternScale: 'scale_to_10'
            }
        ]
    },
    {
        idItems: [
            IdItem.ZAPATOS_ADORNO_DE_ORO,
            IdItem.BOTAS_DE_CUERO,
            IdItem.ZAPATOS_DORADOS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'plane',
                patternScale: 'scale_to_15'
            }
        ]
    },
    {
        idItems: [
            IdItem.BOTAS_DE_BRONCE,
            IdItem.ZAPATOS_DE_JADE,
            IdItem.ZAPATOS_DE_EXTASIS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'plane',
                patternScale: 'scale_to_20'
            }
        ]
    },
    {
        idItems: [
            IdItem.BOTAS_DE_NIMBO,
            IdItem.ZAPATOS_DE_FENIX,
            IdItem.ZAPATOS_PAJARO_FUEGO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'plane',
                patternScale: 'scale_to_25'
            }
        ]
    },
    {
        idItems: [
            IdItem.ZAPATOS_DE_LA_EUFORIA,
            IdItem.BOTAS_DE_GLORIA,
            IdItem.ZAPATOS_PIRICOS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'plane',
                patternScale: 'scale_to_30'
            }
        ]
    },
    {
        idItems: [
            IdItem.ZAPATOS_CORTEZA_DE_BAMBU
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_DE_MADERA
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_ADORNO_DE_ORO
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.BOTAS_DE_CUERO
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_DORADOS
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.BOTAS_DE_BRONCE
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_DE_JADE
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_DE_EXTASIS
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.BOTAS_DE_NIMBO
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_DE_FENIX
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_PAJARO_FUEGO
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.ZAPATOS_DE_LA_EUFORIA
        ],
        implicitBonus: []
    },
    {
        idItems: [
            IdItem.BOTAS_DE_GLORIA
        ],
        implicitBonus: []
    },
        {
        idItems: [
            IdItem.ZAPATOS_PIRICOS
        ],
        implicitBonus: []
    },

]