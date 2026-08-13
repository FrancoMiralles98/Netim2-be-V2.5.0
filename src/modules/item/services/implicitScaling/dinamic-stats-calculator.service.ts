import { Injectable } from "@nestjs/common";
import { WEAPON_BASE_STAT_CONFIG } from "../../config/scaling/weapon-base-stats.config";
import { UPGRADE_MULTIPLIER } from "../../config/scaling/upgrade-multiplayer.config";
import { ARMOR_BASE_STAT_CONFIG } from "../../config/scaling/armor-base-stats.config";
import { StatScalingConfig } from "../../types/config/equip-base-stats.type";
import { BonusRefKeys, subTypeEquip, TypeWeapon, UpgradeLv } from "netim2-shared";

@Injectable()
export class DinamicStatsCalculatorService {

    /**
     * Calcula los implicitos dinamicos  de un arma según su LvReq , tipo de arma,
     * bonus solicitado y upgradeLv.
     *
     * El resultado se devuelve como un rango `{ min, max }`, ya que los bonus
     * de daño (ad | ap) de las armas son valores minimos y maximos  
     *
     * @param lvReq Nivel requerido del arma.
     * @param upgradeLv Nivel de mejora actual del arma.
     * @param type_weapon Tipo de arma utilizada para buscar la configuración base.
     * @param bonus_ref Referencia del bonus que se desea calcular.
     *
     * @returns Rango de valor mínimo y máximo calculado para el bonus del arma.
     *
     * @throws Si no existe configuración base para el tipo de arma y bonus indicado.
     * @throws Si no existe multiplicador para el nivel de mejora indicado.
     */
    calculateWeaponImplicit(
        lvReq: number,
        upgradeLv: UpgradeLv,
        type_weapon: TypeWeapon,
        bonus_ref: BonusRefKeys
    ): { min: number, max: number } {
        const baseConfig = WEAPON_BASE_STAT_CONFIG[type_weapon]?.[bonus_ref]

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

     /**
     * Calcula el implicito dinamico base de una pieza defensiva según su Lvreq,
     * tipo de armadura, bonus solicitado y upgradeLv.
     *
     * A diferencia de las armas, las piezas defensivas devuelven un único valor
     * numérico en lugar de un rango ya qu eno tiene un valor minimo o maximo
     *
     * @param lvReq Nivel requerido de la pieza defensiva.
     * @param upgradeLv Nivel de mejora actual de la pieza defensiva.
     * @param type_armor Subtipo de equipo defensivo usado para buscar la configuración base.
     * @param bonus_ref Referencia del bonus que se desea calcular.
     *
     * @returns Valor final calculado para el bonus defensivo.
     *
     * @throws Si no existe configuración base para el subtipo defensivo y bonus indicado.
     * @throws Si no existe multiplicador para el nivel de mejora indicado.
     */
    calculateArmorImplicit(
        lvReq: number,
        upgradeLv: UpgradeLv,
        type_armor: Extract<subTypeEquip, 'armadura' | 'casco' | 'escudo' | 'botas'>,
        bonus_ref: BonusRefKeys
    ): number {
        const baseConfig = ARMOR_BASE_STAT_CONFIG[type_armor]?.[bonus_ref] as StatScalingConfig

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
}