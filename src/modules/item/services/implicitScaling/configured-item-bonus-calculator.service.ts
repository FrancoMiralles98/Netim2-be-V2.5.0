import { Injectable } from "@nestjs/common";
import { CoreImplicitItem, ImplicitBonusConfig } from "../../types/const/scaling/core-equip-item.type";
import { BonusInItem } from "src/modules/bonus/types/bonus-in-item.type";
import { DinamicStatsCalculatorService } from "./dinamic-stats-calculator.service";
import { PlaneBonusCalculator } from "./plane-bonus-calculator.service";
import { BonusSharedService } from "src/modules/shared/services/bonus-shared.service";
import { UpgradeLv } from "../../types/config/general-implicit.type";
import { ITEM_SCALING_CONST } from "../../const/scaling/item-scaling.const";
import { IdItemList } from "../../types/iditems/id-item-list.type";
import { SpecificImplicitBonusService } from "./specific-implicit-bonus.service";
import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";

@Injectable()
export class ConfiguredItemBonusCalculatorService {
    constructor(
        private dinamicStatsCalculator: DinamicStatsCalculatorService,
        private planeBonusCalculator: PlaneBonusCalculator,
        private bonusSharedService: BonusSharedService,
        private specifiImplicitBonus: SpecificImplicitBonusService,

    ) { }

    /**
  * Obtiene y calcula todos los bonus implícitos configurados para un ítem.
  *
  * Un ítem puede estar asociado a múltiples configuraciones de implícitos
  * (`CoreImplicitItem`). Cada configuración aporta uno o más bonus que serán
  * calculados y transformados al formato estándar utilizado por el sistema.
  *
  * @note - se valida en el item no tenga implicitos duplicados
  *
  * Los valores finales son calculados utilizando el nivel requerido del ítem,
  * el nivel de mejora actual y el tipo de configuración correspondiente
  * (dynamic, plane, static o specific).
  *
  * @param idItem ID del ítem cuyos bonus implícitos serán calculados.
  * @param upgradeLv Nivel de mejora actual del ítem. Por defecto `0`.
  * @param lvReq Nivel requerido del ítem. Por defecto `1`.
  *
  * @returns Lista completa de bonus implícitos calculados para el ítem.
  *
  * @throws Si el ítem no tiene configuraciones implícitas asociadas.
  * @throws Si un mismo bonus está definido en más de una configuración.
  * @throws Si ocurre un error durante el cálculo de alguno de los bonus.
  */
    getConfiguredImplicitStats(
        idItem: IdItemList,
        upgradeLv: UpgradeLv = 0,
        lvReq: number = 1
    ): BonusInItem[] {
        const updatedBonusList: BonusInItem[] = []
        const usedBonusRefs = new Set<BonusRefKeys>()

        const coreImplicitConfigs = this.getScalingImplicitBonus(idItem)

        for (const coreImplicitConfig of coreImplicitConfigs) {

            for (const config of coreImplicitConfig.implicitBonus) {

                if (usedBonusRefs.has(config.bonusRefKey)) {
                    throw new Error(`El item ${idItem} tiene el bonus ${config.bonusRefKey} configurado más de una vez`)
                }

                usedBonusRefs.add(config.bonusRefKey)

                console.log('config a usar',config);
                

                const bonusValue = this.getBonusValue(config, lvReq, upgradeLv, idItem)

                updatedBonusList.push(
                    this.bonusSharedService.transformToBonusInItem(
                        config.bonusRefKey,
                        bonusValue,
                        config.origin
                    )
                )
            }
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
    private getScalingImplicitBonus(idItem: IdItemList): CoreImplicitItem[] {
        const scaling = ITEM_SCALING_CONST.filter(s => s.idItems.includes(idItem))

        if (!scaling) {
            throw new Error(`Not found scaling for ${idItem}`)
        }

        if (scaling.length === 0) {
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
        upgradeLv: UpgradeLv,
        idItem: IdItemList
    ): number | { min: number, max: number } {
        let bonusValue: number | { min: number, max: number } = 0



        switch (config.type) {

            case 'dinamic':
                bonusValue = config.type_equip === 'armor'
                    ? this.dinamicStatsCalculator.calculateArmorImplicit(lvReq, upgradeLv, config.type_armor, config.bonusRefKey)
                    : this.dinamicStatsCalculator.calculateWeaponImplicit(lvReq, upgradeLv, config.type_weapon, config.bonusRefKey)
                break;

            case 'plane':
                bonusValue = this.planeBonusCalculator.calculatePlaneBonus(upgradeLv, config.patternScale)
                if (config.multiplicateValue) {
                    bonusValue = this.multiplyBonusValue(bonusValue, config.multiplicateValue)
                }
                break;
            case 'specific':
                bonusValue = this.specifiImplicitBonus.calculateSpecificBonus(idItem, upgradeLv, config.bonusRefKey, lvReq)
                break;
            case 'static':
                bonusValue = config.value
                break;

            default:
                throw new Error(`Tipo de implicito inválido`)
        }

        return this.applySign(bonusValue, config.sign)
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