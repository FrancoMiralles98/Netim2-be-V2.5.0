import { IdItem } from "netim2-shared";
import { CoreImplicitItem } from "src/modules/item/types/const/scaling/core-equip-item.type";

export const PIEDRAS_SCALING:CoreImplicitItem[] = [
    {
        idItems:[IdItem.PIEDRA_DE_INTELIGENCIA],
        implicitBonus: [
            {
                type: 'static',
                bonusRefKey: 'INT',
                origin: 'configured',
                value: 10
            }
        ]
    }
]