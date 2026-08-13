import { IdItem } from "netim2-shared";
import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";

export const CAMPANA_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
         IdItem.CAMPANA_DE_COBRE,
         IdItem.CAMPANA_DE_PLATA,
         IdItem.CAMPANA_DORADA,
         IdItem.CAMPANA_ANTIGUA,
         IdItem.CAMPANA_DE_JADE,
         IdItem.CAMPANA_FUENTE,
         IdItem.CAMPANA_ALBARICOQUE,
         IdItem.CAMPANA_MAGICA,
         IdItem.CAMPANA_INSECTO_DORADO,
         IdItem.CAMPANA_INSECTO_ACERO,
         IdItem.CAMPANA_PAJARO_TRUENO,
         IdItem.CAMPANA_CIELO_Y_TIERRA,
         IdItem.CAMPANA_BAMBU,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'campana',
                origin: 'configured',
            },
            {
                bonusRefKey: 'ap',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'campana',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_7',
                origin: 'configured',
            }
        ]
    }
]