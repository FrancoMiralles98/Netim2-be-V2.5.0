import { MasteryLvRank } from "../types/skill-lv-rank.types";

/**
 * @description - cuando las habilidades se masterizan (cuando la habilidad se aumenta de nivel
 * y del lv 16 pasa a M1), se sigue subiendo de rango hasta llegar a 10, al llegar al 10 pasa a G1
 * sigue el mismo progreso hasta G10 que luego pasa a P, esta constante define los nombres de pasaje
 * de rangos de M a G y de G a P
 */
export const CHANGE_MASTERY_RANK_LV_VALUES: Record<Extract<MasteryLvRank,'M10' | 'G10'>,Extract<MasteryLvRank,'G1' | 'P'>> = {
    'M10':'G1',
    'G10':'P'
}