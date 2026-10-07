import { IMPLICIT_BONUS_TIER_BY_LV_REQ, RANDOM_IMPLICIT_BONUS_CONFIG } from "../../config/equip-implicit-bonus.config"
import { ImplicitBonusTierType } from "../../types/config/implicit-bonus-tier.type"
import { PatternScaleType } from "../../types/config/general-implicit.type"
import { PATTERN_SCALE_CONFIG } from "../../config/scaling/general-pattern-scale.config"
import { Injectable } from "@nestjs/common"
import { BonusSharedService } from "src/modules/shared/services/bonus-shared.service"
import { BonusInItem, BonusRefKeys, subTypeEquip, UpgradeLv } from "netim2-shared"

@Injectable()
export class RandomImplicitBonusService {
    constructor(
        private bonusSharedService: BonusSharedService
    ) { }

    /**
     * Genera una lista de bonus implícitos aleatorios para un ítem.
     *
     * La cantidad de bonus generados depende del tier asociado al nivel
     * requerido del ítem. Una vez seleccionados los bonus aleatorios,
     * sus valores son calculados y actualizados según el nivel requerido
     * y el nivel de mejora actual del ítem.
     *
     * @note
     * Los bonus generados nunca se repiten dentro de la misma lista.
     * Y estos bonus (por ahora) unicamente se usan en armas
     *
     * @param lvReq Nivel requerido del ítem.
     * @param upgradeLv Nivel de mejora actual del ítem.
     *
     * @returns Lista de bonus implícitos aleatorios con sus valores finales calculados.
     *
     */
    generateRandomImplicitBonus(
        lvReq: number,
        upgradeLv: UpgradeLv,
        sub_type_equip: subTypeEquip
    ): BonusInItem[] {
        if (sub_type_equip !== 'arma') {
            return []
        }

        const tier = this.getTierByLvReq(lvReq)
        const selectedBonusRefs: BonusRefKeys[] = this.getRandomBonusRefsByTier(tier)

        const randomBonusList = selectedBonusRefs.map(bonusRef =>
            this.bonusSharedService.transformToBonusInItem(bonusRef, 0, 'random')
        )
        return this.getUpdatedRandomImplicitBonus(lvReq, randomBonusList, upgradeLv)
    }

    /**
    * Actualiza los valores de los bonus implícitos aleatorios de un ítem.
    *
    * El valor final de cada bonus se calcula según:
    * - El nivel requerido del ítem.
    * - El tier implícito correspondiente a ese nivel.
    * - El tipo de bonus.
    * - El nivel de mejora del ítem.
    *
    * Si no se reciben bonus, devuelve una lista vacía.
    *
    * @param lvReq Nivel requerido del ítem.
    * @param bonuses Lista de bonus implícitos aleatorios a actualizar.
    * @param upgradeLv Nivel de mejora actual del ítem.
    *
    * @returns Lista de bonus con sus valores recalculados.
    */
    getUpdatedRandomImplicitBonus(
        lvReq: number,
        bonuses: BonusInItem[] = [],
        upgradeLv: UpgradeLv
    ): BonusInItem[] {

        const updatedBonus: BonusInItem[] = []
        const tierBonus = this.getTierByLvReq(lvReq)

        for (const bonus of bonuses) {
            const pattern = this.getBonusValuePattern(tierBonus, bonus.bonusRef)
            const value = PATTERN_SCALE_CONFIG[pattern][upgradeLv]

            if (value === undefined) {
                throw new Error(`No se encuentra el valor para pattern ${pattern} y upgrade ${upgradeLv}`)
            }

            updatedBonus.push({ ...bonus, bonusValue: value })
        }

        return updatedBonus
    }


    private getBonusValuePattern(
        tier: ImplicitBonusTierType,
        bonusRefKey: BonusRefKeys
    ): PatternScaleType {
        const config = RANDOM_IMPLICIT_BONUS_CONFIG.possibleBonus.find(c => c.bonusRef === bonusRefKey)

        if (!config) {
            throw new Error(`No se encuentra la config para el bonus ${bonusRefKey}`)
        }

        const bonusValueConfig = config.tierValue.find(tierValue => tierValue.tier === tier)

        if (!bonusValueConfig) {
            throw new Error(`No se encuentra el pattern del tier ${tier}`)
        }

        return bonusValueConfig.pattern
    }



    private getTierByLvReq(lvReq: number): ImplicitBonusTierType {
        const rule = IMPLICIT_BONUS_TIER_BY_LV_REQ.find(rule => lvReq <= rule.maxLv)

        if (!rule) {
            throw new Error(`No existe tier para lvReq ${lvReq}`)
        }

        return rule.tier
    }


    /**
    * Obtiene un arreglo de BonusRef según el tier indicado.
    *
    * La cantidad de bonus a seleccionar se obtiene desde la configuración
    * `quantityByTier`. Los bonus son elegidos de forma aleatoria y nunca
    * se repiten dentro de la misma selección.
    *
    * @param tier Tier implícito utilizado para determinar cuántos bonus generar.
    *
    * @returns Lista de referencias de bonus aleatorias y únicas.
    *
    */
    private getRandomBonusRefsByTier(tier: ImplicitBonusTierType): BonusRefKeys[] {
        const quantityConfig = RANDOM_IMPLICIT_BONUS_CONFIG.quantityByTier.find(
            config => config.tier === tier
        )

        if (!quantityConfig) {
            throw new Error(`No existe cantidad configurada para el tier ${tier}`)
        }

        const possibleBonusRefs = RANDOM_IMPLICIT_BONUS_CONFIG.possibleBonus.map(
            bonus => bonus.bonusRef
        )

        if (quantityConfig.quantity > possibleBonusRefs.length) {
            throw new Error(
                `No hay suficientes bonus únicos para elegir ${quantityConfig.quantity}`
            )
        }

        return this.shuffleBonusRefs(possibleBonusRefs).slice(0, quantityConfig.quantity)
    }


    /**
     * Mezcla aleatoriamente una lista de bonusRef
     *
     * Se crea una copia del arreglo original para evitar modificar la colección
     * recibida por parámetro.
     *
     * @param bonusRefs Lista de referencias de bonus a mezclar.
     *
     * @returns Nueva lista con los elementos en orden aleatorio.
     */
    private shuffleBonusRefs(bonusRefs: BonusRefKeys[]): BonusRefKeys[] {
        const shuffled = [...bonusRefs]

        for (let i = shuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1))

            const currentValue = shuffled[i]
            shuffled[i] = shuffled[randomIndex]
            shuffled[randomIndex] = currentValue
        }

        return shuffled
    }
}