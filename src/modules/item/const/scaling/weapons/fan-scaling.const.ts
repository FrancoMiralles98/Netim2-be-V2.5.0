import { IdItem } from "netim2-shared";
import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";

export const FAN_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.FAN,
            IdItem.FAN_DE_HIERRO,
            IdItem.FAN_TIGRE_NEGRO,
            IdItem.FAN_ALA_GRULLA,
            IdItem.FAN_PAVO_REAL,
            IdItem.FAN_ACUATICO,
            IdItem.FAN_OTONO,
            IdItem.FAN_DE_PIEDRA,
            IdItem.FAN_OCEANO,
            IdItem.FAN_PICADURA,
            IdItem.FAN_FENIX,
            IdItem.TRIPLE_FAN,
            IdItem.FAN_CEJA,
            IdItem.FAN_SOL,
            IdItem.FAN_SALVACION,
            IdItem.FAN_PAJARO_DIVINO,
            IdItem.FAN_EXTASIS,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'fan',
                origin: 'configured',
            },
            {
                bonusRefKey: 'ap',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'fan',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_10',
                origin: 'configured'
            },
        ]
    },
]