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

    getConfiguredImplicitStats(
        idItem: IdItemList,
        upgradeLv: UpgradeLv = 0,
        LvReq: number = 1
    ): BonusInItem[] {
        const updatedBonusList: BonusInItem[] = []

        const configImplicts = this.getScalingImplicitBonus(idItem).implicitBonus



        for (const config of configImplicts) {

            const bonusValue = this.getBonusValue(config, LvReq, upgradeLv)

            updatedBonusList.push(this.bonusSharedService.transformToBonusInItem(
                config.bonusRefKey,
                bonusValue,
                config.origin
            ))
        }
        return updatedBonusList
    }

    private getScalingImplicitBonus(idItem: IdItemList): CoreImplicitItem {
        const scaling = ITEM_SCALING_CONST.find(s => s.idItem === idItem)

        if (!scaling) {
            throw new Error(`Not found scaling for ${idItem}`)
        }

        return scaling
    }


    private getBonusValue(
        config: ImplicitBonusConfig,
        lvReq: number,
        upgradeLv: UpgradeLv
    ): number | { min: number, max: number } {
        let bonusValue: number | { min: number, max: number } = 0

        if (config.type === 'dinamic') {
            bonusValue = config.type_equip === 'armor'
                ? this.dinamicStatsCalculator.calculateArmorStats(lvReq, upgradeLv, config.type_armor, config.bonusRefKey)
                : this.dinamicStatsCalculator.calculateWeaponStats(lvReq, upgradeLv, config.type_weapon, config.bonusRefKey)
        }

        if (config.type === 'plane') {
            bonusValue = this.planeBonusCalculator.calculatePlaneBonus(upgradeLv, config.patternScale)

            if (config.multiplicateValue) {
                bonusValue *= config.multiplicateValue
            }
        }

        if (config.type === 'static') {
            bonusValue = config.value
        }

        if (config.sign && config.sign === 'negative') {
            bonusValue = -Number(bonusValue)
        }

        return bonusValue
    }
}