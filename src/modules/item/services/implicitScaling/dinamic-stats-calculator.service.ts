import { Injectable } from "@nestjs/common";
import { WEAPON_BASE_STAT_CONFIG } from "../../config/scaling/weapon-base-stats.config";
import { subTypeEquip, TypeWeapon } from "../../types/entities-props/equip.type";
import { UPGRADE_MULTIPLIER } from "../../config/scaling/upgrade-multiplayer.config";
import { ARMOR_BASE_STAT_CONFIG } from "../../config/scaling/armor-base-stats.config";
import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { UpgradeLv } from "../../types/config/general-implicit.type";

@Injectable()
export class DinamicStatsCalculatorService {

    calculateWeaponStats(
        lvReq: number,
        upgradeLv: UpgradeLv,
        type_weapon: TypeWeapon,
        bonus_ref: BonusRefKeys
    ): { min: number, max: number } {
        const baseConfig = WEAPON_BASE_STAT_CONFIG[type_weapon][bonus_ref]

        if (!baseConfig) {
            throw new Error(`No se encuentra la config para: ${type_weapon} de tipo ${bonus_ref}`)
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

        return {
            min: Math.round(this.applyUpgradeMultiplier(baseMin, upgradeLv)),
            max: Math.round(this.applyUpgradeMultiplier(baseMax, upgradeLv)),
        }

    }

    calculateArmorStats(
        lvReq: number,
        upgradeLv: number,
        type_armor: Extract<subTypeEquip, 'armadura' | 'casco' | 'escudo' | 'botas'>,
        bonus_ref: BonusRefKeys
    ): number {
        const baseConfig = ARMOR_BASE_STAT_CONFIG[type_armor][bonus_ref]

        if (!baseConfig) {
            throw new Error(`No se encuentra la config para: ${type_armor} de tipo ${bonus_ref}`)
        }

        const baseMin = this.calculateBaseStat(
            lvReq,
            baseConfig.base,
            baseConfig.perLv,
            baseConfig.power,
        )

        return Math.round(this.applyUpgradeMultiplier(baseMin, upgradeLv))
    }

    private calculateBaseStat(
        lvReq: number,
        base: number,
        perLv: number,
        power: number,
    ): number {
        return base + perLv * Math.pow(lvReq, power)
    }

    private applyUpgradeMultiplier(
        baseStat: number,
        upgradeLv: number,
    ): number {
        const multiplier = UPGRADE_MULTIPLIER[upgradeLv]

        if (multiplier === undefined) {
            throw new Error(`No existe multiplicador para upgrade +${upgradeLv}`)
        }

        return baseStat * multiplier
    }
}