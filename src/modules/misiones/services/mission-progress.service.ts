import { Injectable } from "@nestjs/common";
import { UpdateActionMissionProgress, UpdateCollectMissionProgress, UpdateHuntMissionProgress, UpdateMissionProgress } from "../types/progress-mission.type";
import { HuntMission } from "../types/hunt-mission.type";
import { Missions } from "../types/mission-base.type";
import { CollectMission } from "../types/collect-mission.type";
import { ActionMission } from "../types/action-mission.type";

/**
 * Servicio encargado de actualizar el progreso de una misión.
 *
 * Determina el tipo de misión recibida y aplica la lógica correspondiente
 * según el tipo de progreso informado:
 *
 * - `hunt`: reduce la cantidad pendiente de mobs por derrotar.
 * - `collect`: reduce la cantidad pendiente de ítems por recolectar.
 * - `action`: marca la misión como completada al realizar la acción requerida.
 *
 * El servicio modifica directamente la misión recibida.
 */
@Injectable()
export class MissionProgressService {

     /**
     * Actualiza el progreso de una misión según el tipo de evento recibido.
     *
     * Valida que el tipo de progreso coincida con el tipo de misión antes
     * de aplicar la actualización correspondiente.
     *
     * Si los tipos no coinciden, se lanza un error para evitar que una misión
     * sea actualizada con un progreso incompatible.
     *
     * @param progress Progreso recibido a partir de una acción del jugador.
     * @param mission Misión cuyo progreso será actualizado.
     *
     * @throws Si el tipo de progreso no coincide con el tipo de misión.
     */
    updateProgressMission(
        progress: UpdateMissionProgress,
        mission: Missions
    ): void {
        if (mission.type === 'hunt' && progress.type === 'hunt') {
            this.updateHuntMission(progress, mission)
            return
        }

        if (mission.type === 'collect' && progress.type === 'collect') {
            this.updateCollectMission(progress, mission)
            return
        }
        if (mission.type === 'action' && progress.type === 'action') {
            this.updateActionMission(progress, mission)
            return
        }

        throw new Error(`El tipo de progreso ${progress.type} no coincide con la misión ${mission.type}`)
    }

    /**
     * Actualiza el progreso de una misión de caza.
     *
     * Si la misión aún no está completada, busca dentro de los objetivos
     * de caza el mob eliminado en caso de coincidir reduce en `1`
     * la cantidad pendiente.
     *
     * verifica si todos los mobs requeridos fueron derrotados. En ese caso,
     * marca la misión como completada.
     *
     * @param progress Progreso de caza generado al derrotar un mob.
     * @param missions Misión de caza a actualizar.
     */
    private updateHuntMission(
        progress: UpdateHuntMissionProgress,
        missions: HuntMission
    ): void {
        if (missions.missionProgress.isDone) {
            return
        }
        for (const hunt of missions.missionProgress.huntsProgress) {
            if (hunt.idMob === progress.idMob) {
                hunt.quantity = Math.max(hunt.quantity - 1, 0)
            }
        }

        if (missions.missionProgress.huntsProgress.every(hunt => hunt.quantity <= 0)) {
            missions.missionProgress.isDone = true
        }
    }

    /**
     * Actualiza el progreso de una misión de recolección.
     *
     * Si la misión aún no está completada, busca dentro de los objetivos
     * de recolección el ítem correspondiente al progreso recibido y reduce
     * la cantidad pendiente según la cantidad entregada.
     *
     * Luego de actualizar el objetivo, verifica si todos los ítems requeridos
     * fueron recolectados. En ese caso, marca la misión como completada.
     *
     * @param progress Progreso de recolección generado al obtener ítems.
     * @param missions Misión de recolección a actualizar.
     */
    private updateCollectMission(
        progress: UpdateCollectMissionProgress,
        missions: CollectMission
    ): void {
        if (missions.missionProgress.isDone) {
            return
        }
        if (progress.quantity <= 0) {
            return
        }
        for (const collect of missions.missionProgress.collectProgress) {
            if (collect.idItem === progress.idItem) {
                collect.quantity = Math.max(collect.quantity - progress.quantity, 0)
            }
        }

        if(missions.missionProgress.collectProgress.every(collect => collect.quantity <= 0)) {
            missions.missionProgress.isDone = true
        }
    }

    /**
     * Actualiza el progreso de una misión de acción.
     *
     * Compara la acción realizada por el jugador con la acción requerida
     * por la misión. Si ambas coinciden, marca la misión como completada.
     *
     * @param progress Progreso de acción generado por una acción del jugador.
     * @param mission Misión de acción a actualizar.
     */
    private updateActionMission(
        progress: UpdateActionMissionProgress,
        mission: ActionMission
    ) {
        if (progress.action === mission.missionProgress.typeAction) {
            mission.missionProgress.isDone = true
        }
    }
}