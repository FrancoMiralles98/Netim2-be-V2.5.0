import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";
import { IdItem } from "../../../types/iditems/id-item-list.type";

export const ARCO_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
            IdItem.ARCO,
            IdItem.ARCO_LARGO,
            IdItem.ARCO_COMPUESTO,
            IdItem.ARCO_DE_BATALLA,
            IdItem.ARCO_LARGO_DE_MONTAR,
            IdItem.ARCO_DE_BAT_DE_MONTA,
            IdItem.ARCO_CUERNO,
            IdItem.ARCO_COBRE_ARTESANAL,
            IdItem.ARCO_RUINA_NEGRA,
            IdItem.ARCO_OJO_ROJO,
            IdItem.ARCO_HOJA_ESPINOSA,
            IdItem.ARCO_CUERNO_DE_TORO,
            IdItem.ARCO_UNICORNIO,
            IdItem.ARCO_ALA_GIGANTE,
            IdItem.ARCO_ALBARICOQUE_DIV,
            IdItem.ARCO_DRAGON_AMARILLO,
            IdItem.ARCO_DRAGON_AZUL,
            IdItem.ARCO_CUERVO_DE_ACERO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'flecha',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_25',
                origin: 'configured',
            }
        ]
    }
]