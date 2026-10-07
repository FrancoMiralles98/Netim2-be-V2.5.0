import { BonusRefKeys, CombatStatKey } from "netim2-shared";

/**
 * Configuración de límites máximos para cada tipo de bonus
 *
 * Este objeto define el valor máximo que puede alcanzar un bonus específico
 * en el total acumulado del personaje
 * 
 * - Los valores representan el límite superior permitido
 * - Si un bonus supera este valor, se recortara al máximo definido
 *
 */
export const LIMIT_BONUS_CONFIG: Partial<Record<BonusRefKeys, number>> = {
    def_campana: 70,
    def_dos_manos: 70,
    def_daga: 70,
    def_espada: 70,
    def_flecha: 70,
    def_fan: 70,
    def_magia: 70,
    def_media: 14,
    def_hab: 14,
    vh: 100,
    bloquear_ataques: 40,
    def_incendio: 80,
    def_sangrado: 80,
    def_veneno: 80,
    esquivar_ataques: 50,
}

export const COMBAT_STAT_TO_BONUS_REF: Partial<Record<CombatStatKey, BonusRefKeys>> = {

    "general.vh": 'vh',
    "bonus.defensa.bloquear_ataques": 'bloquear_ataques',
    "bonus.defensa.esquivar_ataques": 'esquivar_ataques',

    "bonus.defensa.def_campana": 'def_campana',
    "bonus.defensa.def_dos_manos": 'def_dos_manos',
    "bonus.defensa.def_daga": 'def_daga',
    "bonus.defensa.def_espada": 'def_espada',
    "bonus.defensa.def_flecha": 'def_flecha',
    "bonus.defensa.def_fan": 'def_fan',
    "bonus.defensa.def_magia": 'def_magia',

    "bonus.defensa.def_media": 'def_media',
    "bonus.defensa.def_hab": 'def_hab',

    "bonus.defensa.def_incendio": 'def_incendio',
    "bonus.defensa.def_sangrado": 'def_sangrado',
    "bonus.defensa.def_veneno": 'def_veneno',
};