import { Injectable } from "@nestjs/common";
import { WEAPON_BASE_STAT_CONFIG } from "../config/scaling/weapon-base-stats.config";
import { TypeWeapon } from "../types/entities-props/equip.type";
import { WEAPON_UPGRADE_STAT_CONFIG } from "../config/scaling/weapon-upgrade.config";

@Injectable()
export class WeaponStatsCalculatorService {

    calculateWeaponDmg(
        lvReq: number,
        upgradeLv: number,
        type_weapon: TypeWeapon,
        type_dmg: 'ad' | 'ap'
    ): { min: number; max: number } {
        const baseConfig = WEAPON_BASE_STAT_CONFIG[type_weapon][type_dmg]
        const upgradeConfig = WEAPON_UPGRADE_STAT_CONFIG[type_weapon][type_dmg]

        if (!baseConfig || !upgradeConfig) {
            throw new Error(`No se encuentran las configs para: ${type_weapon} de tipo ${type_dmg}`)
        }

        const baseMin = this.calculateBaseStat(
            lvReq,
            baseConfig.min.base,
            baseConfig.min.perLv,
            baseConfig.min.power,
        )

        const baseMax = this.calculateBaseStat(
            lvReq,
            baseConfig.max.base,
            baseConfig.max.perLv,
            baseConfig.max.power,
        )

        const upgradeMinBonus = this.calculateUpgradeBonus(
            upgradeLv,
            upgradeConfig.min.perLv,
            upgradeConfig.min.power,
        )

        const upgradeMaxBonus = this.calculateUpgradeBonus(
            upgradeLv,
            upgradeConfig.max.perLv,
            upgradeConfig.max.power,
        )

        return {
            min: Math.round(baseMin + upgradeMinBonus),
            max: Math.round(baseMax + upgradeMaxBonus),
        }
    }

    private calculateBaseStat(
        lvReq: number,
        base: number,
        perLv: number,
        power: number,
    ): number {
        return base + perLv * Math.pow(lvReq, power)
    }

    private calculateUpgradeBonus(
        upgradeLv: number,
        perUpgrade: number,
        power: number,
    ): number {
        if (upgradeLv <= 0) {
            return 0
        }

        return perUpgrade * Math.pow(upgradeLv, power)
    }
}