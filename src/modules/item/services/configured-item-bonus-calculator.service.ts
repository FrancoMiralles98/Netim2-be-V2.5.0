import { Injectable } from "@nestjs/common";
import { ImplicitBonusConfig } from "../types/const/core-equip-item.type";
import { BonusInItem } from "src/modules/bonus/types/bonus-in-item.type";
import { DinamicStatsCalculatorService } from "./dinamic-stats-calculator.service";
import { StaticStatsCalculator } from "./static-stats-calculator.service";
import { BonusSharedService } from "src/modules/shared/services/bonus-shared.service";
import { UpgradeLv } from "../types/config/general-implicit.type";

@Injectable()
export class ConfiguredItemBonusCalculatorService {
    constructor(
        private dinamicStatsCalculator: DinamicStatsCalculatorService,
        private staticStatsCalculator: StaticStatsCalculator,
        private bonusSharedService: BonusSharedService
    ) { }

    getCoreImplicitStats(
        implicit: ImplicitBonusConfig[],
        upgradeLv: UpgradeLv,
        LvReq: number
    ): BonusInItem[] {
        const bonusList: BonusInItem[] = []

        for (const config of implicit) {

            const bonusValue = this.getBonusValue(config, LvReq, upgradeLv)

            bonusList.push(this.bonusSharedService.transformToBonusInItem(
                config.bonusRefKey, 
                bonusValue,
                config.origin
            ))
        }
        return bonusList
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
            bonusValue = this.staticStatsCalculator.calculatePlaneStat(upgradeLv, config.patternScale)

            if (config.multiplicateValue) {
                bonusValue *= config.multiplicateValue
            }
        }

        if (config.sign === 'negative') {
            bonusValue = -Number(bonusValue)
        }

        return bonusValue
    }
}