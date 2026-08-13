import { IdItemList } from "netim2-shared";
import { MissionBase, TypeMission } from "./mission-base.type";

/**
 * Representa una misión de recolección.
 *
 * Este tipo de misión requiere que el jugador obtenga una cantidad
 * determinada de ítems y entregarlo completar el objetivo.
 *
 * @property type Tipo fijo de misión. En este caso siempre será `collect`.
 * @property missionProgress Progreso actual de la misión de recolección.
 */
export interface CollectMission extends MissionBase {
    type: Extract<TypeMission, 'collect'>;
    missionProgress: CollectMissionProgress
}

export interface CollectMissionProgress {
    isDone: boolean;
    collectProgress: CollectProgress[];
}

export interface CollectProgress {
    idItem: IdItemList;
    quantity: number;
    name?: string;
}