import { IdMobList } from "src/modules/mob/types/id-mob-list.enum";
import { TypeMission } from "./mission-base.type";
import { IdItemList } from "netim2-shared";

/**
 * Datos utilizados para actualizar el progreso de una misión.
 *
 * Representa cualquier tipo de progreso que puede recibir el sistema
 * de misiones. Según el tipo de misión, el progreso puede corresponder
 * a una caza, una recolección o una acción específica realizada por
 * el jugador.
 *
 * Este tipo se utiliza como entrada del método encargado de actualizar
 * el progreso de las misiones.
 */
export type UpdateMissionProgress = 
UpdateHuntMissionProgress  |
UpdateCollectMissionProgress |
UpdateActionMissionProgress


/**
 * Progreso utilizado para actualizar una misión de caza.
 *
 * Se genera cuando el jugador derrota un mob. El sistema utiliza el
 * `idMob` para verificar si ese mob forma parte de los objetivos de
 * la misión y, en caso afirmativo, reduce la cantidad pendiente.
 *
 * @property type Tipo de progreso. En este caso siempre será `hunt`.
 * @property idMob ID del mob derrotado.
 */
export interface UpdateHuntMissionProgress {
    type: Extract<TypeMission, "hunt">;
    idMob: IdMobList
}

/**
 * Progreso utilizado para actualizar una misión de recolección.
 *
 * Se genera cuando el jugador entrega un tiem a la mission. El sistema utiliza
 * el `idItem` para verificar si ese ítem forma parte de los objetivos de
 * la misión y reduce la cantidad pendiente según `quantity` entregada.
 *
 * @property type Tipo de progreso. En este caso siempre será `collect`.
 * @property idItem ID del ítem recolectado.
 * @property quantity Cantidad enviada del ítem.
 */
export interface UpdateCollectMissionProgress {
    type: Extract<TypeMission, "collect">;
    idItem: IdItemList,
    quantity: number
}

/**
 * Progreso utilizado para actualizar una misión de acción.
 *
 * Se genera cuando el jugador realiza una acción específica dentro del
 * juego, como subir un atributo, elegir especialidad, mejorar un ítem,
 * usar un sistema o completar una interacción determinada.
 *
 * El sistema compara `action` con la acción requerida por la misión.
 * Si coinciden, la misión se marca como completada.
 *
 * @property type Tipo de progreso. En este caso siempre será `action`.
 * @property action Identificador de la acción realizada por el jugador.
 */
export interface UpdateActionMissionProgress {
    type: Extract<TypeMission, "action">;
    action: string
}