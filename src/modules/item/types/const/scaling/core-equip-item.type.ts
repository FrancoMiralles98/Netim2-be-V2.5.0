import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"
import { PatternScaleType } from "../../config/general-implicit.type"
import { BonusOrigin } from "src/modules/bonus/types/bonus-in-item.type";
import { DinamicImplicitConfig, } from "./dinamic-implict.type";
import { IdItemList } from "../../iditems/id-item-list.type";
import { SpecificImplicitConfig } from "./specific-implict.types";

/**
 * Define una configuración compartida de bonus implícitos para uno o más ítems.
 *
 * Esta estructura permite reutilizar la misma configuración de escalado
 * entre distintos ítems que comparten estadísticas implícitas similares,
 * evitando duplicar configuraciones.
 *
 * Un mismo ítem puede pertenecer a múltiples configuraciones distintas.
 * Por ejemplo:
 *
 * - Una configuración puede contener los bonus de ataque físico (`ad`)
 *   y ataque mágico (`ap`).
 * - Otra configuración independiente puede contener velocidad de ataque (`va`).
 *
 * Durante el proceso de cálculo, todas las configuraciones asociadas al ítem
 * son combinadas para obtener la lista completa de bonus implícitos.
 */
export interface CoreImplicitItem {
    implicitBonus: ImplicitBonusConfig[]
    idItems: IdItemList[]
}

export type ImplicitBonusConfig =
    DinamicImplicitConfig |
    PlaneImplicitConfig |
    StaticImplicitConfig |
    SpecificImplicitConfig


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
    sign?: 'positive' | 'negative';
    bonusRefKey: BonusRefKeys;
    origin: Extract<BonusOrigin, 'configured'>
}