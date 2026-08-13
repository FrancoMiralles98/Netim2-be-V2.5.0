import { CharacterRace } from "netim2-shared";
import { CharacterStatsProgress } from "../../types/character-stats-progress.type";

/**
 * Define la progresión de estadísticas base y por nivel para cada raza del personaje.
 *
 * Funcionamiento:
 * - Cada raza (`guerrero`, `chaman`, `ninja`, `sura`) tiene sus propios valores base
 *   y escalados por nivel.
 * - Los valores `base_*` representan las estadísticas iniciales del personaje.
 * - Los valores `*_per_lv` indican cuánto crece cada stat al subir de nivel.
 *
 */
export const STATS_PROGRESS_BY_RACE:Record<CharacterRace,CharacterStatsProgress> = {
    guerrero: {
        base_hp: 0,
        base_regen_hp: 0.3,
        base_DEX: 4,
        base_INT: 2,
        base_STR: 6,
        base_VIT: 6,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    },
    chaman: {
        base_hp: 0,
        base_regen_hp: 0.3,
        base_DEX: 4,
        base_INT: 7,
        base_STR: 3,
        base_VIT: 5,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    },
    ninja: {
        base_hp: 0,
        base_regen_hp: 0.3,
        base_DEX: 6,
        base_INT: 3,
        base_STR: 4,
        base_VIT: 5,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    },
    sura: {
        base_hp: 0,
        base_regen_hp: 0.3,
        base_DEX: 4,
        base_INT: 4,
        base_STR: 4,
        base_VIT: 6,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    }
}