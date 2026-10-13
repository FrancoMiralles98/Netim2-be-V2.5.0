import { Injectable } from "@nestjs/common";
import { RngService } from "src/modules/shared/services/rng.service";
import { BonusCategory, BonusInItem, ItemBonusQuality, subTypeEquip } from "netim2-shared";
import { GenerateBonusService } from "./generateBonus/generate-bonus.service";


@Injectable()
export class GenerateItemBonusService {
    constructor(
        private generateBonusService: GenerateBonusService,
        private rngService: RngService
    ) { }

    /**
    * Genera la lista final de bonus para un ítem según la acción solicitada.
    *
    * Acciones soportadas:
    * - add: añade nuevos bonus respetando el límite máximo.
    * - change: reemplaza los bonus actuales conservando su cantidad, hasta el límite.
    * - random: genera quantity bonus; bonusUsed solo contiene exclusiones.
    *
    * @param bonusUsed Bonus actuales en add/change; exclusiones en random.
    * @param bonusCategory Categoría de bonus a generar.
    * @param type Tipo de operación a realizar.
    * @param itemLv Nivel interno del ítem utilizado para escalar valores.
    * @param quaility Calidad utilizada para determinar la calidad de los bonus generados.
    * @param maxQuantity Cantidad máxima de bonus permitidos.
    *
    * @returns Lista final de bonus generados.
    */
    buildItemBonus(
        bonusUsed: BonusInItem[] = [],
        bonusCategory: BonusCategory,
        type: 'add' | 'change' | 'random',
        itemLv: number,
        quaility: ItemBonusQuality = 'normal',
        maxQuantity: number,
        sub_type_equip: subTypeEquip,
        quantity?:number
    ): BonusInItem[] {

        if (!Number.isInteger(maxQuantity) || maxQuantity < 0) {
            throw new Error('El límite de bonus debe ser un entero no negativo')
        }

        if (type === 'add') {
            return this.executeAddBonus(bonusUsed, bonusCategory, itemLv, quaility, maxQuantity,sub_type_equip)
        }

        if (type === 'random') {
            if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
                throw new Error('La cantidad de bonus debe ser un entero no negativo')
            }
            return this.executeChangeBonus(quantity, bonusCategory, itemLv, quaility, maxQuantity,sub_type_equip, bonusUsed)
        }

        return this.executeChangeBonus(bonusUsed.length, bonusCategory, itemLv, quaility, maxQuantity,sub_type_equip)
    }

    /**
     * Añade uno o más bonus al ítem.
     *
     * Si el ítem ya alcanzó la cantidad máxima permitida,
     * no genera más bonus. Si ya excedía el límite, ajusta la lista devuelta.
     *
     * En caso de que el bonus generado haga que se supere
     * el límite permitido (por ejemplo bonus especiales que
     * generan dos bonus a la vez), se ajusta automáticamente
     * la cantidad final.
     *
     * @param bonusUsed Bonus actuales del ítem.
     * @param bonusCategory Categoría de bonus a generar.
     * @param itemLv Nivel interno del ítem utilizado para escalar valores.
     * @param quaility Calidad utilizada para determinar la calidad de los bonus generados.
     * @param maxQuantity Cantidad máxima de bonus permitidos.
     *
     * @returns Lista de bonus actualizada.
     */
    private executeAddBonus(
        bonusUsed: BonusInItem[] = [],
        bonusCategory: BonusCategory,
        itemLv: number,
        quaility: ItemBonusQuality,
        maxQuantity: number,
        sub_type_equip: subTypeEquip
    ) {
        if (bonusUsed.length >= maxQuantity) {
            return this.adjustBonusQuantityCap(bonusUsed, maxQuantity)
        }
        const bonus = this.generateBonusService.generateBonus(bonusCategory, bonusUsed, itemLv, quaility,sub_type_equip)
        return this.adjustBonusQuantityCap([...bonusUsed, ...bonus], maxQuantity)
    }

    /**
    * Genera la cantidad solicitada, contando cada integrante del par como un bonus.
    *
    * Genera una nueva lista de bonus utilizando la misma
    * cantidad de bonus que poseía originalmente el ítem,
    * respetando el límite máximo permitido.
    *
    * @param totalBonus Cantidad solicitada.
    * @param excludedBonuses Bonus externos que no deben repetirse en la nueva lista.
    * @param bonusCategory Categoría de bonus a generar.
    * @param itemLv Nivel interno del ítem utilizado para escalar valores.
    * @param quaility Calidad utilizada para determinar la calidad de los bonus generados.
    * @param maxQuantity Cantidad máxima de bonus permitidos.
    *
    * @returns Nueva lista de bonus generados.
    */
    private executeChangeBonus(
        totalBonus: number,
        bonusCategory: BonusCategory,
        itemLv: number,
        quaility: ItemBonusQuality,
        maxQuantity: number,
        sub_type_equip: subTypeEquip,
        excludedBonuses: BonusInItem[] = []
    ) {
        const newBonuses: BonusInItem[] = []
        const targetQuantity = Math.min(totalBonus, maxQuantity)

        while (newBonuses.length < targetQuantity) {
            const bonus = this.generateBonusService.generateBonus(
                bonusCategory, [...excludedBonuses, ...newBonuses], itemLv, quaility, sub_type_equip)
            newBonuses.push(...bonus)
        }
        return this.adjustBonusQuantityCap(newBonuses, targetQuantity)
    }

    /**
    * Ajusta la cantidad de bonus cuando se supera el límite permitido.
    *
    * Regla especial:
    * - Los bonus "media" y "habilidad" forman un conjunto inseparable.
    * - Si ambos están presentes, nunca se eliminarán para cumplir el límite.
    * - En su lugar, se elimina aleatoriamente otro bonus disponible.
    *
    * Si no existen bonus especiales, simplemente se recorta
    * la lista al tamaño máximo permitido.
    *
    * @param bonuses Lista de bonus a validar.
    * @param maxQuantity Cantidad máxima permitida.
    *
    * @returns Lista de bonus ajustada al límite configurado.
    *
    * @throws Error Si el límite se supera y no existe ningún
    * bonus eliminable distinto de media/habilidad.
    */
    private adjustBonusQuantityCap(
        bonuses: BonusInItem[],
        maxQuantity: number,
    ): BonusInItem[] {
        const adjustedBonuses = [...bonuses]
        if (adjustedBonuses.length <= maxQuantity) {
            return adjustedBonuses
        }

        const hasSpecialBonus = bonuses.some(
            bonus => bonus.bonusRef === 'media' || bonus.bonusRef === 'habilidad',
        )

        if (!hasSpecialBonus) {
            return bonuses.slice(0, maxQuantity)
        }

        while (adjustedBonuses.length > maxQuantity) {
            const removableBonuses = adjustedBonuses.filter(
                bonus =>
                    bonus.bonusRef !== 'media' &&
                    bonus.bonusRef !== 'habilidad',
            )

            if (removableBonuses.length === 0) {
                throw new Error(
                    'No se puede ajustar el cap de bonus sin separar media/habilidad',
                )
            }

            const bonusToRemove = removableBonuses[
                this.rngService.randomNumberInRange(0, removableBonuses.length - 1)
            ]

            adjustedBonuses.splice(adjustedBonuses.indexOf(bonusToRemove), 1)
        }
        return adjustedBonuses
    }
}
