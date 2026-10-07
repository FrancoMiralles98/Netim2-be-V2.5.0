import { Injectable } from "@nestjs/common";
import { SPECIFIC_BASE_STATS } from "../../config/scaling/specific-base-stats.config";
import { DamageScalingConfig, StatScalingConfig } from "../../types/config/equip-base-stats.type";
import { UPGRADE_MULTIPLIER } from "../../config/scaling/upgrade-multiplayer.config";
import { BonusRefKeys, IdItemList, UpgradeLv } from "netim2-shared";

@Injectable()
export class SpecificImplicitBonusService {

/**
 * Calcula el valor de un bonus implícito asociado a un ítem especifico.
 *
 * Este método utiliza la configuración definida en `SPECIFIC_BASE_STATS`
 * para obtener el escalado correspondiente al bonus solicitado y calcular
 * su valor final según el nivel requerido del ítem y su nivel de mejora.
 *
 * Dependiendo de la configuración encontrada, el resultado puede ser:
 * - Un valor numérico.
 * - Un rango de valores `{ min, max }`.
 *
 * @param idItem ID del ítem cuya configuración específica será utilizada.
 * @param upgradeLv Nivel de mejora actual del ítem.
 * @param bonus_ref Referencia del bonus que se desea calcular.
 * @param lvReq Nivel requerido del ítem.
 *
 * @returns Valor calculado del bonus específico. Puede ser un número o un rango.
 */
    calculateSpecificBonus(
        idItem: IdItemList,
        upgradeLv: UpgradeLv,
        bonus_ref: BonusRefKeys,
        lvReq: number
    ): { min: number, max: number } | number {
        const config = SPECIFIC_BASE_STATS[idItem]
        if (!config) {
            throw new Error(`No se encuentra una configuracion para el idItem: ${idItem}`)
        }

        const statScaling = config[bonus_ref]

        if (!statScaling) {
            throw new Error(`No se encuentra una configuracion para la stat: ${bonus_ref}`)
        }

        if (this.isRangeScaling(statScaling)) {
            return this.calculateRangeValue(statScaling, lvReq, upgradeLv)
        }
        return this.calculateValue(statScaling,upgradeLv,lvReq)
    }


    private calculateValue(
        config: StatScalingConfig,
        upgradeLv: UpgradeLv,
        lvReq: number
    ): number {
        const baseMin = this.calculateBaseStat(
            lvReq,
            config.base,
            config.perLv,
            config.power,
        )

        return Math.round(this.applyUpgradeMultiplier(baseMin, upgradeLv))
    }

    private calculateRangeValue(
        dmgConfig: DamageScalingConfig,
        lvReq: number,
        upgradeLv: UpgradeLv
    ): { min: number, max: number } {
        const baseMin = this.calculateBaseStat(
            lvReq,
            dmgConfig.min.base,
            dmgConfig.min.perLv,
            dmgConfig.min.power,
        )

        const baseMax = this.calculateBaseStat(
            lvReq,
            dmgConfig.max.base,
            dmgConfig.max.perLv,
            dmgConfig.max.power,
        )

        return {
            min: Math.round(this.applyUpgradeMultiplier(baseMin, upgradeLv)),
            max: Math.round(this.applyUpgradeMultiplier(baseMax, upgradeLv)),
        }
    }


    /**
     * Calcula el valor base de un stat antes de aplicar modificadores por mejora.
     *
     * @param lvReq Nivel requerido del ítem.
     * @param base Valor base inicial del stat.
     * @param perLv Incremento aplicado por nivel.
     * @param power Potencia usada para escalar el nivel requerido.
     *
     * @returns Valor base calculado antes del multiplicador de mejora.
     */
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

    private isRangeScaling(scaling: DamageScalingConfig | StatScalingConfig): scaling is DamageScalingConfig {
        return 'min' in scaling && 'max' in scaling
    }
}