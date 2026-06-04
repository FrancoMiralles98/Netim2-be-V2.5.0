import { Injectable } from "@nestjs/common";
import { BonusCategory } from "../types/bonusListHelper/bonus.type";
import { BonusInItem } from "../types/bonus-in-item.type";
import { ItemBonusQuality } from "../types/item-bonus-quaility.type";
import { GenerateBonusService } from "./generate-bonus.service";
import { RngService } from "src/modules/shared/services/rng.service";

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
    * - change: reemplaza completamente los bonus existentes por nuevos.
    *
    * @param bonusUsed Bonus actuales del ítem.
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
        quantity?:number
    ): BonusInItem[] {

        if (type === 'add') {
            return this.executeAddBonus(bonusUsed, bonusCategory, itemLv, quaility, maxQuantity)
        }

        if (type === 'random') {
            if (!quantity) {
                throw new Error('No hay una cantidad valida de para ejecutar')
            }
            this.executeChangeBonus(quantity, bonusCategory, itemLv, quaility, maxQuantity)
        }

        return this.executeChangeBonus(bonusUsed.length, bonusCategory, itemLv, quaility, maxQuantity)
    }

    /**
     * Añade uno o más bonus al ítem.
     *
     * Si el ítem ya alcanzó la cantidad máxima permitida,
     * no realiza ninguna modificación.
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
        maxQuantity: number
    ) {
        if (bonusUsed.length >= maxQuantity) {
            return bonusUsed
        }
        const bonus = this.generateBonusService.generateBonus(bonusCategory, bonusUsed, itemLv, quaility)
        bonusUsed.push(...bonus)
        if (bonusUsed.length > maxQuantity) {
            return this.adjustBonusQuantityCap(bonusUsed, maxQuantity)
        }
        return bonusUsed
    }

    /**
    * Reemplaza completamente los bonus actuales del ítem.
    *
    * Genera una nueva lista de bonus utilizando la misma
    * cantidad de bonus que poseía originalmente el ítem,
    * respetando el límite máximo permitido.
    *
    * @param bonusUsed Bonus actuales del ítem.
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
        maxQuantity: number
    ) {
        const newBonuses: BonusInItem[] = []

        for (let index = 0; index < totalBonus; index++) {
            if (newBonuses.length >= maxQuantity) {
                break;
            }
            const bonus = this.generateBonusService.generateBonus(bonusCategory, newBonuses, itemLv, quaility)
            newBonuses.push(...bonus)
        }
        return this.adjustBonusQuantityCap(newBonuses, maxQuantity)
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
        if (bonuses.length <= maxQuantity) {
            return bonuses
        }

        const hasSpecialBonus = bonuses.some(
            bonus => bonus.bonusRef === 'media' || bonus.bonusRef === 'habilidad',
        )

        if (!hasSpecialBonus) {
            return bonuses.slice(0, maxQuantity)
        }

        const removableBonuses = bonuses.filter(
            bonus =>
                bonus.bonusRef !== 'media' &&
                bonus.bonusRef !== 'habilidad',
        )

        if (removableBonuses.length === 0) {
            throw new Error(
                'No se puede ajustar el cap de bonus sin separar media/habilidad',
            )
        }

        const bonusToRemove =
            removableBonuses[
            this.rngService.randomNumberInRange(0, removableBonuses.length - 1)
            ]

        return bonuses.filter(bonus => bonus !== bonusToRemove)
    }
}