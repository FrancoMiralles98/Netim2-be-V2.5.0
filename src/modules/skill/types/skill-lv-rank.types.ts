/**
 * Representa los rangos avanzados de una skill una vez superado el nivel base.
 *
 * @description
 * Cuando una skill alcanza su nivel máximo base (lv 16),
 * el siguiente progreso la convierte en una skill "masterizada",
 * iniciando una nueva etapa de niveles especiales.
 *
 * Progresión completa:
 * - lv 1 → 16 → nivel base
 * - M1 → M10 → Master
 * - G1 → G10 → Grand Master
 * - P → Perfect (nivel máximo)
 *
 * @note
 * A partir de M1, las skills ya no suben de nivel mediante experiencia,
 * sino utilizando materiales específicos:
 *
 * - M (Master) → libros de skill
 * - G (Grand Master) → piedra alma
 * - P (Perfect) → nivel máximo, no se puede mejorar más
 */
export type MasteryLvRank = 
'M1' |
'M2' |
'M3' |
'M4' |
'M5' |
'M6' |
'M7' |
'M8' |
'M9' |
'M10' |
'G1' |
'G2' |
'G3' |
'G4' |
'G5' |
'G6' |
'G7' |
'G8' |
'G9' |
'G10' |
'P'