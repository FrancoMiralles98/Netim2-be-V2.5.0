import { CharacterStatsProgress } from "../../types/character-stats-progress.type";
import { CharacterRace } from "../../types/baseCharacterProps/character-stats.type";

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
        base_regen_hp: 0,
        base_DEX: 0,
        base_INT: 0,
        base_STR: 0,
        base_VIT: 0,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    },
    chaman: {
        base_hp: 0,
        base_regen_hp: 0,
        base_DEX: 0,
        base_INT: 0,
        base_STR: 0,
        base_VIT: 0,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    },
    ninja: {
        base_hp: 0,
        base_regen_hp: 0,
        base_DEX: 0,
        base_INT: 0,
        base_STR: 0,
        base_VIT: 0,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    },
    sura: {
        base_hp: 0,
        base_regen_hp: 0,
        base_DEX: 0,
        base_INT: 0,
        base_STR: 0,
        base_VIT: 0,
        ad_per_lv: 0,
        ap_per_lv: 0,
        hp_per_lv: 0,
        va_per_lv: 0,
        vm_per_lv: 0,
        vh_per_lv: 0
    }
}