import { BonusDefensaRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";

/**
 * Relación entre cada tipo de arma y su bonus defensivo correspondiente.
 *
 * Se utiliza para obtener automáticamente la defensa específica
 * contra el tipo de arma utilizada por el atacante.
 */
export const DEFENSE_BY_WEAPON: Record<TypeWeapon,BonusDefensaRefKeys> = {
    campana: 'def_campana',
    daga: 'def_daga',
    dos_manos: 'def_dos_manos',
    espada: 'def_espada',
    fan: 'def_fan',
    flecha: 'def_flecha',
}