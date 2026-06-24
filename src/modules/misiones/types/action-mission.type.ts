import { MissionBase, TypeMission } from "./mission-base.type";

/**
 * Representa una misión de acción.
 *
 * Este tipo de misión se completa cuando el jugador realiza una acción
 * específica dentro del juego, mejorar un ítem, elegir una especialidad
 * u otra interacción.
 *
 * @property type Tipo fijo de misión. En este caso siempre será `action`.
 * @property missionProgress Progreso actual de la misión de acción.
 */
export interface ActionMission extends MissionBase{
    type: Extract<TypeMission,"action">,
    missionProgress: ActionMissionProgress
}

export interface ActionMissionProgress {
    typeAction: string;
    isDone: boolean
}