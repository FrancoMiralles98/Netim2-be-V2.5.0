import { Injectable } from "@nestjs/common";
import { Missions } from "../types/mission-base.type";
import { MISSION_LIST } from "../const/mission-list.const";
import { IdMissionsList } from "../types/idMissions/id-mission-list.enum";
import { MissionInCharacter } from "netim2-shared";

/**
 * Servicio encargado de consultar la información base de las misiones.
 *
 * Este servicio trabaja sobre el catálogo estático de misiones (`MISSION_LIST`)
 * y permite obtener misiones disponibles, buscar una misión por ID y reconstruir
 * la información completa de las misiones que el personaje tiene en progreso.
 *
 * No se encarga de actualizar progreso ni de completar misiones.
 */
@Injectable()
export class MissionCatalogService {

    /**
     * Obtiene las misiones disponibles para un personaje.
     *
     * Una misión se considera disponible si:
     * - El personaje cumple con el nivel requerido.
     * - El personaje completó todas las misiones requeridas previamente.
     * - La misión no está actualmente en progreso.
     * - La misión no fue completada anteriormente.
     *
     * @param missionsDone Lista de IDs de misiones ya completadas por el personaje.
     * @param missionsInProgress Lista de misiones actualmente en progreso.
     * @param characterLv Nivel actual del personaje.
     *
     * @returns Lista de misiones disponibles para aceptar.
     */
    getAvailableMissions(
        missionsDone: IdMissionsList[],
        missionInProgress: Missions[],
        characterLv: number
    ): Missions[] {
        return MISSION_LIST.filter(mission =>
            mission.missionReq.lvReq <= characterLv &&
            mission.missionReq.idMissionDone.every(idMission => missionsDone.includes(idMission)) &&
            !missionInProgress.some(missionProgress => missionProgress.idMission === mission.idMission) &&
            !missionsDone.includes(mission.idMission)
        )
    }

    /**
     * Obtiene la información base de una misión a partir de su ID.
     *
     * @param idMission ID de la misión a buscar.
     *
     * @returns Información base de la misión encontrada.
     *
     * @throws Si no existe una misión asociada al ID recibido.
     */
    getMissionInfoById(idMission: IdMissionsList): Missions {
        const mision = MISSION_LIST.find(m => m.idMission === idMission)

        if (!mision) {
            throw new Error(`No se encuentra la mision idMIssion ${idMission}`)
        }

        return mision
    }

    /**
     * Reconstruye la información completa de las misiones en progreso de un personaje.
     *
     * Las misiones guardadas en el personaje suelen contener únicamente la información
     * persistente necesaria, como el ID de misión y su progreso actual.
     *
     * Este método toma cada misión en progreso, obtiene su información base desde
     * el catálogo de misiones y reemplaza el progreso original por el progreso
     * guardado en el personaje.
     *
     * De esta forma se obtiene una misión completa lista para ser consultada,
     * mostrada o procesada.
     *
     * @param missionsInProgress Lista de misiones en progreso guardadas en el personaje.
     *
     * @returns Lista de misiones completas con el progreso actual del personaje.
     *
     * @throws Si alguna misión en progreso no existe en el catálogo base.
     */
    getCharacterMissionInfo(missionInProgress: MissionInCharacter[]): Missions[] {
        const missions: Missions[] = []

        for (const mission of missionInProgress) {
            const missionData = structuredClone(MISSION_LIST.find(m => m.idMission === mission.idMission))
            if (!missionData) {
                throw new Error(`No se encuentra la info de la mission ${mission.idMission}`)
            }
            missionData.missionProgress = mission.missionProgress
            missions.push(missionData)
        }

        return missions
    }
}