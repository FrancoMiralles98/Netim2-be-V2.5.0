import { Injectable } from "@nestjs/common";
import { BonusRefKeys } from "netim2-shared";
import { BONUS_LIST } from "src/modules/bonus/const/bonus-list.cons";
import { BonusInItem } from "src/modules/bonus/types/bonus-in-item.type";

@Injectable()
export class BonusSharedService {

    /**
    * Transforma una referencia de bonus y su valor en una estructura {@link BonusInItem},
    * completando automáticamente la información descriptiva del bonus a partir de {@link BONUS_LIST}.
    *
    * Busca la definición del bonus mediante su `bonusRefKey`
    *
    * @param bonusRefKey - Identificador único del bonus a transformar.
    * @param bonusValue - Valor del bonus. Puede ser un número fijo o un rango `{ min, max }`.
    *
    * @returns Objeto {@link BonusInItem} listo para ser utilizado en ítems, generación de bonus o cálculos.
    *
    * @throws {Error} Si no existe una definición para el bonus indicado en {@link BONUS_LIST}.
    */
    transformToBonusInItem(
        bonusRefKey: BonusRefKeys,
        bonusValue: number | { min: number, max: number },
        origin: BonusInItem['origin']
    ): BonusInItem {
        const bonusInfo = BONUS_LIST.find(bonus => bonus.name.bonus_ref_name === bonusRefKey)

        if (!bonusInfo) {
            throw new Error(`No se encuentra la informacion del bonus ref: ${bonusRefKey}`)
        }

        return {
            bonusFullName: bonusInfo.name.full_name,
            bonusRef: bonusRefKey,
            bonusValue,
            bonusValueType: bonusInfo.name.type_value,
            origin
        }
    }
}