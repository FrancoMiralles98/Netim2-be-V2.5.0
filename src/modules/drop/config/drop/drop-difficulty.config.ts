import { MobDifficulty } from "src/modules/mob/types/mobProps/mob-difficult.type";
import { DropDifficultyConfig } from "../../types/drop.dificult.type";
import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type";

/**
 * Configuración global de drops según el tipo de enemigo
 * y su nivel de dificultad.
 *
 * Esta tabla define cómo se comporta el sistema de drops
 * para cada combinación de:
 *
 * - Tipo de enemigo (`mob`, `netim`, `boss`, `raid`)
 * - Dificultad del enemigo (`1`, `2`, `3`)
 *
 * Cada configuración controla:
 *
 * - `attempts`
 *   Cantidad de intentos de drop que realiza el enemigo
 *   al ser derrotado. Cada intento puede resultar en:
 *   nada, yang o un ítem.
 *
 * - `resultChances`
 *   Probabilidades ponderadas utilizadas para determinar
 *   el resultado de cada intento de drop
 *
 * - `bonusItemLv`
 *   Bonificación aleatoria aplicada al nivel del ítem
 *   generado. Permite que enemigos más peligrosos tengan
 *   acceso a equipamiento de mayor nivel que el esperado
 *   para su nivel base.
 */
export const DROP_CONFIG_BY_ENEMY_TYPE: Record<
    EnemyType,
    Record<MobDifficulty, DropDifficultyConfig>
> = {
    mob: {
        1: {
            attempts: { min: 1, max: 4 },
            resultChances: { nothing: 60, yang: 25, item: 15 },
            bonusItemLv: { min: 0, max: 3 },
        },
        2: {
            attempts: { min: 1, max: 5 },
            resultChances: { nothing: 50, yang: 32, item: 18 },
            bonusItemLv: { min: 2, max: 5 },
        },
        3: {
            attempts: { min: 2, max: 5 },
            resultChances: { nothing: 40, yang: 35, item: 25 },
            bonusItemLv: { min: 4, max: 7 },
        },
    },
    netim: {
        1: {
            attempts: { min: 2, max: 4 },
            resultChances: { nothing: 35, yang: 35, item: 30 },
            bonusItemLv: { min: 6, max: 10 },
        },
        2: {
            attempts: { min: 3, max: 5 },
            resultChances: { nothing: 25, yang: 35, item: 40 },
            bonusItemLv: { min: 8, max: 13 },
        },
        3: {
            attempts: { min: 4, max: 6 },
            resultChances: { nothing: 20, yang: 30, item: 50 },
            bonusItemLv: { min: 10, max: 16 },
        },
    },
    boss: {
        1: {
            attempts: { min: 4, max: 6 },
            resultChances: { nothing: 20, yang: 30, item: 50 },
            bonusItemLv: { min: 10, max: 15 },
        },
        2: {
            attempts: { min: 5, max: 8 },
            resultChances: { nothing: 15, yang: 25, item: 60 },
            bonusItemLv: { min: 15, max: 21 },
        },
        3: {
            attempts: { min: 6, max: 10 },
            resultChances: { nothing: 10, yang: 25, item: 65 },
            bonusItemLv: { min: 18, max: 25 },
        },
    },
    raid: {
        1: {
            attempts: { min: 7, max: 10 },
            resultChances: { nothing: 5, yang: 20, item: 75 },
            bonusItemLv: { min: 20, max: 28 },
        },
        2: {
            attempts: { min: 9, max: 12 },
            resultChances: { nothing: 2, yang: 18, item: 80 },
            bonusItemLv: { min: 24, max: 32 },
        },
        3: {
            attempts: { min: 12, max: 16 },
            resultChances: { nothing: 0, yang: 15, item: 85 },
            bonusItemLv: { min: 30, max: 40 },
        },
    },
}