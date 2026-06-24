import { IdMobList } from "src/modules/mob/types/id-mob-list.enum";
import { MissionBase, TypeMission } from "./mission-base.type";

/**
 * Representa una misión de caza.
 *
 * Este tipo de misión requiere que el jugador derrote una cantidad
 * determinada de mobs para completar el objetivo.
 *
 * @property type Tipo fijo de misión. En este caso siempre será `hunt`.
 * @property missionProgress Progreso actual de la misión de caza.
 */
export interface HuntMission extends MissionBase {
    type: Extract<TypeMission, "hunt">;
    missionProgress:HuntMissionProgress
}

export interface HuntMissionProgress {
    isDone: boolean;
    huntsProgress: HuntsProgress[];

}

export interface HuntsProgress {
    idMob: IdMobList;
    quantity: number;
    name?: string;
}