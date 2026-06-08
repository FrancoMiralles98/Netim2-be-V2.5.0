import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"
import { PatternScaleType } from "../config/general-implicit.type"
import { EquipType, } from "../entities-props/equip.type";
import { BonusOrigin } from "src/modules/bonus/types/bonus-in-item.type";
import { DinamicImplicitConfig, } from "./dinamic-implict.type";

/**
 * Representa un equipamiento que se utiliza a la hora de guardar la informacion base ne la DB
 */
export type CoreEquipItem = Omit<EquipType, 'implicitBonus'> & {
    implicitBonus: ImplicitBonusConfig[];
}


export type ImplicitBonusConfig = DinamicImplicitConfig | PlaneImplicitConfig | StaticImplicitConfig


/**
 * Configuración de bonus implícito estático.
 *
 * Utiliza un valor fijo que no depende del nivel del ítem,
 * tier, mejora u otras variables de escalado.
 */
export interface StaticImplicitConfig extends BaseImplicitConfig {
    type: 'static'
    value: number
}


/**
 * Configuración de bonus implícito escalable mediante un patrón.
 *
 * El valor final del bonus se obtiene a partir de un patrón de escalado
 * definido en {@link PATTERN_SCALE_CONFIG}, el multiplcateValue es para poder
 * tener mas flexibilidad en los valores finales de los bonuses, por ejemplo en Max Hp
 * que requiere valores mas altos que los de un bonus normal
 */
export interface PlaneImplicitConfig extends BaseImplicitConfig {
    type: 'plane'
    patternScale: PatternScaleType
    multiplicateValue?: number
}


/**
 * Configuración base de un bonus implícito.
 *
 * @property sign - Define si el valor del bonus se aplicará de forma positiva o negativa.
 *
 * @property bonusRefKey - Referencia única del bonus que será generado o aplicado.
 * Se utiliza para identificar el bonus dentro del sistema y obtener su información asociada.
 *
 * @property origin - Origen del bonus implícito.
 * En esta configuración siempre indica que el bonus proviene de la definición base
 * del equipamiento y no de una generación aleatoria.
 */
export interface BaseImplicitConfig {
    sign: 'positive' | 'negative';
    bonusRefKey: BonusRefKeys;
    origin: Extract<BonusOrigin, 'configured'>
}