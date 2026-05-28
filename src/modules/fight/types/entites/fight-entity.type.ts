import { SkillType } from "src/modules/skill/types/const/skill.type";
import { FightStats } from "./fight-stats.type";
import { FightDetails } from "./fight-details.type";
import { CharacterRace } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { MobRace } from "src/modules/mob/types/mobProps/mob-race.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";
import { SpawnConfig } from "src/modules/mob/types/mobProps/spawn-config.type";

/**
 * Representa un luchador participante en el combate.
 *
 * Contiene toda la información necesaria para ejecutar acciones,
 * aplicar efectos, calcular daño y registrar el estado del combate.
 *
 * @property {FightStats} stats - Stats del personaje.
 *
 * @property {SkillType[]} hab - Lista de habilidades personaje.
 *
 * @property {FightDetails} fight_details - Información y registros del combate actual.
 *
 * @property {string} nombre - Nombre del personaje.
 *
 * @property {CharacterRace | MobRace} raza - Raza o tipo de entidad del personaje.
 *
 * @property {AllTargetType} target_type - Tipo de objetivo que representa.
 *
 * @property {TypeWeapon | ''} type_weapon - Tipo de arma equipada.
 *
 * @property {SpawnConfig} [spawnConfig] - Configuración de invocaciones.
 *
 * @property {FighterEffectDescription} effects - Efectos de estado activos aplicados al personaje.
 */
export interface FighterType {
    stats: FightStats,
    hab: SkillType[],
    fight_details: FightDetails,
    nombre: string,
    raza: CharacterRace | MobRace
    target_type: AllTargetType
    type_weapon: TypeWeapon | ''
    spawnConfig?: SpawnConfig
    effects: FighterEffectDescription
}


/**
 * Lista de efectos activos aplicados al luchador.
 *
 * Incluye efectos de daño, control de masas y efectos especiales.
 *
 * @property {DmgEffectDescription} veneno - Estado de veneno activo.
 *
 * @property {DmgEffectDescription} incendio - Estado de incendio activo.
 *
 * @property {DmgEffectDescription} sangrado - Estado de sangrado activo.
 *
 * @property {CcEffectDescription} desmayo - Estado de desmayo activo.
 *
 * @property {CcEffectDescription} retardo - Estado de retardo activo.
 *
 * @property {boolean} doble_golpe - Indica si el luchador tiene doble golpe activo.
 */
export interface FighterEffectDescription {
    veneno: DmgEffectDescription;
    incendio: DmgEffectDescription;
    sangrado: DmgEffectDescription;
    desmayo: CcEffectDescription;
    retardo: CcEffectDescription;
    doble_golpe: boolean;
}

/**
 * Descripción de un efecto de daño activo.
 *
 * @property {number} dmgOfEffect - Daño que aplica el efecto por tick.
 *
 * @property {'damage'} type - Tipo de efecto.
 */
export interface DmgEffectDescription extends BasicEffectDescription {
    dmgOfEffect: number;
    type: 'damage'
}

/**
 * Descripción de un efecto de control de masas activo.
 * 
 * @property {'cc'} type - Tipo de efecto de control.
 */
export interface CcEffectDescription extends BasicEffectDescription {
    type: 'cc'
}

/**
 * Información base compartida por todos los efectos del combate.
 *
 * @property {boolean} isActive - Indica si el efecto está activo.
 *
 * @property {number} turnsRemaining - Cantidad de turnos restantes antes de finalizar el efecto.
 */
export interface BasicEffectDescription {
    isActive: boolean;
    turnsRemaining: number;
}