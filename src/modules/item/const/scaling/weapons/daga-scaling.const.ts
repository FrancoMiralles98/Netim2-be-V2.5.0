import { IdItem } from "netim2-shared";
import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";

export const DAGA_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
             IdItem.DAGA,
             IdItem.AMIJA,
             IdItem.DAGA_COBRA,
             IdItem.NUEVE_HOJAS,
             IdItem.DAGA_TIJERA,
             IdItem.CUCHILLO_CORTO,
             IdItem.DIRK_HOJA_NEGRA,
             IdItem.DAGA_AFORTUNADA,
             IdItem.DAGA_MORDISCO_DE_GATO,
             IdItem.DAGA_MASCARA_DIABLO,
             IdItem.DAGA_PUNO_DIABLO,
             IdItem.DAGA_SANGRIENTA,
             IdItem.DAGA_COSTILLA,
             IdItem.CHAKRAM,
             IdItem.DAGA_RELAMPAGO,
             IdItem.DAGA_DRAGON,
             IdItem.DAGA_SIAMESA,
             IdItem.CHAKRAM_ALA_DEMONIO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'daga',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_5',
                origin: 'configured',
            }
        ]
    }
]