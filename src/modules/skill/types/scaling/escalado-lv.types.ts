/**
 * Representa el escalado de una skill basado en su nivel y rango.
 *
 * @property {number} perLv
 * Valor base que se multiplica por el nivel de la skill.
 *
 * @example
 * Si perLv = 2:
 * - lv 16  → 2 * 16 = 32
 * - M5     → 2 * 21 = 42 (16 + 5 niveles de master)
 *
 * @property {number} basicMulti
 * Multiplicador aplicado a skills no masterizadas (nivel ≤ 16).
 *
 * @property {number} masterMulti
 * Multiplicador aplicado a skills en rango Master (M1–M10).
 *
 * @property {number} grandMasterMulti
 * Multiplicador aplicado a skills en rango Grand Master (G1–G10).
 *
 * @property {number} perfectMulti
 * Multiplicador aplicado a skills en rango Perfect (P).
 *
 * @note
 * El cálculo final suele ser:
 * (perLv * nivel) * multiplicador según rango
 */
export interface SkillScalingLv {
    perLv: number,
    basicMulti: number,
    masterMulti: number,
    granMasterMulti: number,
    perfectMulti: number
}