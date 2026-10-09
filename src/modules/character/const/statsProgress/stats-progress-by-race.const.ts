import { CharacterRace } from "netim2-shared";
import { CharacterStatsProgress } from "../../types/character-stats-progress.type";

/**
 * Define la progresión de estadísticas base y por nivel para cada raza del personaje.
 *
 * Funcionamiento:
 * - Cada raza (`guerrero`, `chaman`, `ninja`, `sura`) tiene sus propios valores base
 *   y escalados por nivel.
 * - Los valores `base` representan las estadísticas iniciales del personaje.
 * - Los valores `per_lv` indican cuánto crece cada stat al subir de nivel.
 *
 * @note - ESTOS VALORES ESTAN PSEUDO BALANCEADOS (NO ESTAN TESTEADOS)
 */
export const STATS_PROGRESS_BY_RACE: Record<CharacterRace, CharacterStatsProgress> = {
    guerrero: {
        base: {
            hp: 900,
            mana: 250,
            ap: 5,
            ad: 12,
            regen_hp: 8,
            regen_mana: 3,
        },

        per_lv: {
            hp: 26,
            mana: 5,

            ap: 1,
            ad: 2,

            regen_hp: 0.10,
            regen_mana: 0.04,
        }
    },

    chaman: {
        base: {
            hp: 650,
            mana: 600,
            ap: 13,
            ad: 5,
            regen_hp: 4,
            regen_mana: 10,
        },

        per_lv: {
            hp: 16,
            mana: 16,
            ap: 2.2,
            ad: 0.8,
            regen_hp: 0.06,
            regen_mana: 0.14,
        }
    },

    ninja: {
        base: {
            hp: 720,
            mana: 350,
            ap: 7,
            ad: 11,
            regen_hp: 6,
            regen_mana: 6,
        },

        per_lv: {
            hp: 19,
            mana: 8,
            ap: 1.2,
            ad: 1.8,
            regen_hp: 0.07,
            regen_mana: 0.07,
        }
    },

    sura: {
        base: {
            hp: 780,
            mana: 500,
            ap: 10,
            ad: 9,
            regen_hp: 7,
            regen_mana: 8,
        },

        per_lv: {
            hp: 21,
            mana: 12,
            ap: 1.7,
            ad: 1.4,
            regen_hp: 0.09,
            regen_mana: 0.10,
        }
    }
};
