import { Injectable } from "@nestjs/common";
import { CoreImplicitItem, ImplicitBonusConfig } from "../../types/const/core-equip-item.type";
import { BonusInItem } from "src/modules/bonus/types/bonus-in-item.type";
import { DinamicStatsCalculatorService } from "./dinamic-stats-calculator.service";
import { PlaneBonusCalculator } from "./plane-bonus-calculator.service";
import { BonusSharedService } from "src/modules/shared/services/bonus-shared.service";
import { UpgradeLv } from "../../types/config/general-implicit.type";
import { ITEM_SCALING_CONST } from "../../const/scaling/item-scaling.const";
import { IdItemList } from "../../types/iditems/id-item-list.type";

@Injectable()
export class ConfiguredItemBonusCalculatorService {
    constructor(
        private dinamicStatsCalculator: DinamicStatsCalculatorService,
        private planeBonusCalculator: PlaneBonusCalculator,
        private bonusSharedService: BonusSharedService
    ) { }

     /**
     * Obtiene los bonus implícitos que son de tipo "configured" de un ítem y calcula sus valores finales
     * según el nivel requerido del ítem y su nivel de mejora.
     *
     * Este método toma la configuración base de escalado del ítem, resuelve el valor
     * correspondiente para cada bonus implícito y lo transforma al formato estándar
     * utilizado por los ítems del juego.
     *
     * los bonus implícitos de tipo "configured" pueden ser:
     * - `dinamic`: calculados según stats dinámicas como lvReq potenciadores segun el tipo de equipo y upgradeLv.
     * - `plane`: calculados mediante patrones planos de escalado por mejora.
     * - `static`: valores fijos definidos directamente en la configuración y que no cambian de valor.
     *
     * @param idItem ID único del ítem dentro de la lista de ítems.
     * @param upgradeLv Nivel de mejora actual del ítem. Por defecto es `0`.
     * @param lvReq Nivel requerido del ítem. Por defecto es `1`.
     *
     * @returns Lista de bonus implícitos calculados en formato `BonusInItem`.
     *
     * @throws Si no existe configuración de escalado para el ítem.
     * @throws Si el ítem no tiene bonus implícitos configurados.
     * @throws Si algún bonus implícito tiene un tipo inválido.
     */
    getConfiguredImplicitStats(
        idItem: IdItemList,
        upgradeLv: UpgradeLv = 0,
        lvReq: number = 1
    ): BonusInItem[] {
        const updatedBonusList: BonusInItem[] = []

        const configImplicts = this.getScalingImplicitBonus(idItem).implicitBonus



        for (const config of configImplicts) {

            const bonusValue = this.getBonusValue(config, lvReq, upgradeLv)

            updatedBonusList.push(this.bonusSharedService.transformToBonusInItem(
                config.bonusRefKey,
                bonusValue,
                config.origin
            ))
        }
        return updatedBonusList
    }

    /**
     * Busca la configuración de escalado implícito correspondiente a un ítem.
     *
     * @param idItem ID único del ítem.
     *
     * @returns Configuración base de bonus implícitos del ítem.
     */
    private getScalingImplicitBonus(idItem: IdItemList): CoreImplicitItem {
        const scaling = ITEM_SCALING_CONST.find(s => s.idItem === idItem)

        if (!scaling) {
            throw new Error(`Not found scaling for ${idItem}`)
        }

        if (scaling.implicitBonus.length === 0) {
            throw new Error(`${idItem} no tiene implicitos asignados`)
        }

        return scaling
    }

    /**
     * Calcula el valor final de un bonus implícito según su tipo de configuración.
     *
     * @param config Configuración del bonus implícito.
     * @param lvReq Nivel requerido del ítem.
     * @param upgradeLv Nivel de mejora actual del ítem.
     *
     * @returns Valor final del bonus. Puede ser un número o un rango `{ min, max }`.
     *
     * @throws Si el tipo de bonus implícito no es válido.
     */
    private getBonusValue(
        config: ImplicitBonusConfig,
        lvReq: number,
        upgradeLv: UpgradeLv
    ): number | { min: number, max: number } {
        let bonusValue: number | { min: number, max: number } = 0

        switch (config.type) {

            case 'dinamic':
                bonusValue = config.type_equip === 'armor'
                    ? this.dinamicStatsCalculator.calculateArmorImplicit(lvReq, upgradeLv, config.type_armor, config.bonusRefKey)
                    : this.dinamicStatsCalculator.calculateWeaponImplicit(lvReq, upgradeLv, config.type_weapon, config.bonusRefKey)
                break;

            case 'plane':
                bonusValue = bonusValue = this.planeBonusCalculator.calculatePlaneBonus(upgradeLv, config.patternScale)
                if (config.multiplicateValue) {
                    bonusValue = this.multiplyBonusValue(bonusValue, config.multiplicateValue)
                }
                break;

            case 'static':
                bonusValue = config.value
                break;

            default:
                throw new Error(`Tipo de implicito inválido`)
        }

        return this.applySign(bonusValue,config.sign)
    }

    private applySign(
        value: number | { min: number, max: number },
        sign?: 'positive' | 'negative',
    ): number | { min: number, max: number } {
        if (sign !== 'negative') {
            return value
        }

        if (typeof value === 'number') {
            return -Number(value)
        }
        return { min: -Number(value.min), max: -Number(value.max) }
    }

    private multiplyBonusValue(
        value: number | { min: number; max: number },
        multiplier: number,
    ): number | { min: number; max: number } {
        if (typeof value === 'number') {
            return value * multiplier
        }

        return {
            min: value.min * multiplier,
            max: value.max * multiplier,
        }
    }
}