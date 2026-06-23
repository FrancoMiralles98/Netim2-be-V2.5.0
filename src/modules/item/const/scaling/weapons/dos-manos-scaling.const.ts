import { CoreImplicitItem } from "../../../types/const/scaling/core-equip-item.type";
import { IdItem } from "../../../types/iditems/id-item-list.type";

export const DOS_MANOS_SCALING: CoreImplicitItem[] = [
    {
        idItems: [
             IdItem.GLAIVE,
             IdItem.LANZA,
             IdItem.GUILLOTINA,
             IdItem.LANZA_ARANA,
             IdItem.GISAME,
             IdItem.GISAME,
             IdItem.GUADANA_DE_GUERRA,
             IdItem.HIERRO_ROJO,
             IdItem.HORCA_DE_BATALLA,
             IdItem.HALBERD,
             IdItem.HACHA_GIGANTE,
             IdItem.PICO_GLACIAR,
             IdItem.ESPADA_DOCE_ESPIRITUS,
             IdItem.HOJA_SALVACION,
             IdItem.LEON_ASESINO,
             IdItem.ESPADA_ELECTROMAGNETICA,
             IdItem.PARTIDARIO,
             IdItem.HOJA_ROBA_ALMAS,
             IdItem.ESPADA_RESENTIMIENTO,
        ],
        implicitBonus: [
            {
                bonusRefKey: 'ad',
                type: 'dinamic',
                type_equip: 'weapon',
                type_weapon: 'dos_manos',
                origin: 'configured',
            },
            {
                bonusRefKey: 'va',
                type: 'plane',
                patternScale: 'descending_scale_from_20',
                origin: 'configured',
            }
        ]
    }

]