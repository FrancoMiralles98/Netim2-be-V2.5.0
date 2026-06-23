import { subTypeEquip, TypeWeapon } from "../../entities-props/equip.type"
import { BaseImplicitConfig } from "./core-equip-item.type"

export type DinamicImplicitConfig = DinamicWeaponConfig | DinamicArmorConfig

/**
 * Configuración de bonus implícito dinámico para armas.
 *
 * Permite asociar una configuración específica a un tipo de arma,
 * de modo que el sistema pueda generar o calcular sus bonus implícitos
 * utilizando reglas particulares para dicha categoría.
 */
export interface DinamicWeaponConfig extends BaseDinamicImplicitConfig {
    type_equip: 'weapon'
    type_weapon: TypeWeapon,
}

/**
 * Configuración de bonus implícito dinámico para armaduras.
 *
 * Permite asociar una configuración específica a una categoría
 * de equipamiento defensivo.
 */
export interface DinamicArmorConfig extends BaseDinamicImplicitConfig {
    type_equip: 'armor'
    type_armor: Extract<subTypeEquip, 'armadura' | 'casco' | 'escudo' | 'botas'>,
}

/**
 * Configuración base para bonus implícitos dinámicos.
 *
 * Identifica que los valores de los bonus se calculan mediante configuraciones
 * en base al upgradeLv , lvReq tipo de equipamiento
 */
export interface BaseDinamicImplicitConfig extends BaseImplicitConfig {
    type: 'dinamic'
}