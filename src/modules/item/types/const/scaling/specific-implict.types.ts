import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"
import { DamageScalingConfig, StatScalingConfig } from "../../config/equip-base-stats.type"
import { BaseImplicitConfig } from "./core-equip-item.type"

/**
 * Configuración de bonus implícitos específicos para un ítem.
 *
 * Se utiliza para definir qué bonus pueden ser calculados mediante
 * el sistema de escalado específico asociado a un `idItem`.
 *
 * A diferencia de los bonus dinámicos o planos, los bonus de tipo
 * `specific` obtienen sus valores desde configuraciones particulares
 * definidas para cada ítem.
 */
export interface SpecificImplicitConfig extends BaseImplicitConfig {
    type: 'specific'
}

export type StatsScalingConfig = Partial<Record<BonusRefKeys, DamageScalingConfig | StatScalingConfig>>