import { BonusRefKeys } from "netim2-shared";

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
export const LIMIT_BONUS_CONFIG:Partial<Record<BonusRefKeys,number>> = {
def_campana: 70,
def_dos_manos: 70,
def_daga: 70,
def_espada: 70,
def_flecha: 70,
def_fan: 70,
def_magia: 70,
def_media: 14,
def_hab: 14,
vh: 60,
bloquear_ataques: 40,
def_incendio: 80,
def_sangrado: 80,
def_veneno: 80,
esquivar_ataques: 50,
}