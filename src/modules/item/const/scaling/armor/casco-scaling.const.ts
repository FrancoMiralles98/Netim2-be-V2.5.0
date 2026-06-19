import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";
import { IdItem } from "../../../types/iditems/id-item-list.type";

export const CASCO_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.SOMBRERO_DE_MONJE,
            IdItem.SOMBRERO_FENIX,
            IdItem.SOMBRERO_LUZ_DEL_SOL,
            IdItem.SOMBRERO_DE_CARDENAL,
            IdItem.CASCO_TRADICIONAL,
            IdItem.CASCO_DE_HIERRO,
            IdItem.SALLET_MASCARA_FANT,
            IdItem.MASCARA_TERRORIFICA,
            IdItem.CAPUCHA_DE_CUERO,
            IdItem.CAPUCHA_DE_CADENA,
            IdItem.CAPUCHA_DE_ACERO,
            IdItem.CAPUCHA_DE_ORCO,
            IdItem.YELMO_SANGRIENTO,
            IdItem.YELMO_BURLON,
            IdItem.YELMO_CASTILLO,
            IdItem.CASCO_CON_CUERNOS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'def',
                origin: 'configured',
                type: 'dinamic',
                type_equip: 'armor',
                type_armor: 'casco'
            }
        ]
    },
    {
        idItems: [
            IdItem.SOMBRERO_FENIX,
            IdItem.CASCO_DE_HIERRO,
            IdItem.CAPUCHA_DE_CADENA,
            IdItem.YELMO_BURLON,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'static',
                value: 5,
                sign: 'negative'
            }
        ]
    },
    {
        idItems: [
            IdItem.SOMBRERO_LUZ_DEL_SOL,
            IdItem.SALLET_MASCARA_FANT,
            IdItem.CAPUCHA_DE_ACERO,
            IdItem.YELMO_CASTILLO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'static',
                value: 9,
                sign: 'negative'
            }
        ]
    },
    {
        idItems: [
            IdItem.SOMBRERO_DE_CARDENAL,
            IdItem.MASCARA_TERRORIFICA,
            IdItem.CAPUCHA_DE_ORCO,
            IdItem.CASCO_CON_CUERNOS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'vm',
                origin: 'configured',
                type: 'static',
                value: 11,
                sign: 'negative'
            }
        ]
    }
]