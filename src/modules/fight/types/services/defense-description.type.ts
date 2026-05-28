import { BonusDefensaRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";


export type ActionDefenderType = BasicAttackDefenseDescriptionType | SkillDefenseDescriptionType

/**
 * Resultado defensivo contra un ataque básico.
 *
 * @property {'def_basic_attack'} type_action - Identificador de defensa contra ataque básico.
 *
 * @property {number} dmgToReceive - Daño final que recibirá el defensor.
 *
 * @property {number} reflectar_dmg - Cantidad de daño reflejado al atacante.
 *
 * @property {defensiveChance} defensiveChance - Resultado de las defensas activadas.
 * Incluye bloqueo, esquivar, cortar curación y reflejar daño.
 */
export interface BasicAttackDefenseDescriptionType {
    type_action: 'def_basic_attack'
    dmgToReceive: number;
    reflectar_dmg: number;
    defensiveChance: defensiveChance
}

/**
 * Resultado de las chances defensivas aplicables contra ataques básicos.
 *
 * @property {boolean} bloquear_ataques - Indica si el defensor bloqueó el ataque.
 *
 * @property {boolean} esquivar_ataques - Indica si el defensor esquivó el ataque.
 *
 * @property {boolean} corta_curacion - Indica si el defensor redujo la curación del atacante.
 *
 * @property {boolean} reflectar - Indica si el defensor reflejó daño al atacante.
 */
export type defensiveChance = Record<
    Extract<BonusDefensaRefKeys, 'bloquear_ataques' | 'esquivar_ataques' | 'corta_curacion' | 'reflectar'>,
    boolean>


/**
 * Resultado defensivo contra una habilidad.
 *
 * @property {'def_skill'} type_action - Identificador de defensa contra habilidad.
 *
 * @property {number} dmgToReceive - daño final que recibira el defensor.
 *
 * @property {number} reflectar_dmg - Cantidad de daño reflejado al atacante.
 *
 * @property {{ corta_curacion: boolean }} defensiveChance - Resultado de las defensas aplicables contra habilidades.
 *  @property {boolean} corta_curacion: si aplica o no el efecto de corta curación
 */
export interface SkillDefenseDescriptionType {
    type_action: 'def_skill'
    dmgToReceive: number;
    reflectar_dmg: number;
    defensiveChance: {
        corta_curacion: boolean
    },
    potentialSkill?: {
        idSkill: number;
        finalDmg: number
    }
}