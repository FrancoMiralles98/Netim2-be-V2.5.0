import { IdItemList, ItemDTO, UpgradeLv } from "netim2-shared";
import { ActionMission } from "./action-mission.type";
import { CollectMission } from "./collect-mission.type";
import { HuntMission } from "./hunt-mission.type";
import { IdMissionsList } from "./idMissions/id-mission-list.enum";

export type Missions = ActionMission | CollectMission | HuntMission


/**
 * Configuración base de una misión disponible en el juego.
 *
 * Contiene la información necesaria para mostrar la misión, validar
 * sus requisitos, identificar su tipo y definir las recompensas que
 * recibirá el jugador al completarla.
 *
 * @property idMission Identificador único de la misión.
 * @property type Tipo o categoría de misión.
 * @property name Nombre visible de la misión.
 * @property description Descripción completa de la misión.
 * @property shortDescription Descripción corta
 * @property missionReward Recompensas otorgadas al completar la misión.
 * @property note Nota opcional con información adicional para el jugador.
 * @property missionReq Requisitos necesarios para desbloquear o aceptar la misión.
 * @property mainMission Indica si la misión pertenece a la línea principal de progreso.
 */
export interface MissionBase {
    idMission: IdMissionsList;
    name: string;
    description: string;
    shortDescription: string;
    missionReward: MissionReward;
    note?:string
    missionReq:MissionReq;
    mainMission: boolean;
}

/**
 * Tipos de misión disponibles.
 *
 * - `hunt`: misión basada en derrotar enemigos.
 * - `collect`: misión basada en recolectar recursos o ítems.
 * - `action`: misión basada en realizar una acción específica (como mejorar un item, o hacer x cosa).
 */
export type TypeMission = 'hunt' | 'collect' | 'action'

/**
 * Requisitos necesarios para acceder a una misión.
 *
 * @property lvReq Nivel mínimo requerido del personaje.
 * @property idMissionDone Lista de misiones que deben estar completadas previamente.
 */
export interface MissionReq {
    lvReq: number;
    idMissionDone: number[]
}

export interface MissionReward {
    yang: number;
    exp: number;
    itemsConfig: ItemsConfig[];
    items: ItemDTO[]
}

/**
 * Recompensas otorgadas al completar una misión.
 *
 * Puede incluir yang, experiencia e ítems generados a partir de una
 * configuración previa.
 *
 * @property yang Cantidad de yang otorgada.
 * @property exp Cantidad de experiencia otorgada.
 * @property itemsConfig Configuración de los ítems que se generarán como recompensa.
 * @property items Ítem o ítems finales entregados al jugador.
 */
export interface ItemsConfig {
    idItem: IdItemList;
    itemOptions: EquipItemOptions | UtilityItemOptions
}

export interface EquipItemOptions {
    type: 'equip'
    upgradeLv: UpgradeLv;
}

export interface UtilityItemOptions {
    type: 'utility';
    cantidad: number;
}