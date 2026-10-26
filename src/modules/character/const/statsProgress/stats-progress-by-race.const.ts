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
 * Presupuestos por raza: base 1200 HP/mana, 10 AD/AP y 15 de regeneración;
 * por nivel 30 HP/mana, 3 AD/AP y 0.20 de regeneración.
 * Igualar presupuestos no garantiza el balance efectivo en combate.
 */
export const STATS_PROGRESS_BY_RACE: Record<CharacterRace, CharacterStatsProgress> = {
    guerrero: {
        base: {
            hp: 950,
            mana: 250,
            ap: 2,
            ad: 8,
            regen_hp: 12,
            regen_mana: 3,
        },

        per_lv: {
            hp: 24,
            mana: 6,

            ap: 0.6,
            ad: 2.4,

            regen_hp: 0.16,
            regen_mana: 0.04,
        }
    },

    chaman: {
        base: {
            hp: 650,
            mana: 550,
            ap: 8,
            ad: 2,
            regen_hp: 4,
            regen_mana: 11,
        },

        per_lv: {
            hp: 14,
            mana: 16,
            ap: 2.4,
            ad: 0.6,
            regen_hp: 0.06,
            regen_mana: 0.14,
        }
    },

    ninja: {
        base: {
            hp: 800,
            mana: 400,
            ap: 4,
            ad: 6,
            regen_hp: 8,
            regen_mana: 7,
        },

        per_lv: {
            hp: 18,
            mana: 12,
            ap: 1.2,
            ad: 1.8,
            regen_hp: 0.10,
            regen_mana: 0.10,
        }
    },

    sura: {
        base: {
            hp: 850,
            mana: 350,
            ap: 5,
            ad: 5,
            regen_hp: 9,
            regen_mana: 6,
        },

        per_lv: {
            hp: 20,
            mana: 10,
            ap: 1.5,
            ad: 1.5,
            regen_hp: 0.12,
            regen_mana: 0.08,
        }
    }
};
