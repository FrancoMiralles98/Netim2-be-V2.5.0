import { Injectable } from "@nestjs/common";
import { IdMissionsList } from "../types/idMissions/id-mission-list.enum";
import { EXP_PER_LV } from "src/modules/character/const/exp-per-lv.const";
import { EXP_MISSION_CONFIG } from "../config/exp-mission.config";
import { ItemsConfig } from "../types/mission-base.type";
import { isEquipItem, isPiedraItem, isUtilityItem } from "src/modules/item/types/item-type-guard.type";
import { ItemService } from "src/modules/item/item.service";
import { ItemDTO } from "netim2-shared";

@Injectable()
export class MissionRewardService {
    constructor(
        private itemService: ItemService
    ) {}

    /**
    * Genera la lista de ítems que serán entregados como recompensa de misión.
    *
    * Recorre la configuración de recompensas (`itemsConfig`), obtiene la
    * información base de cada ítem a partir de su `idItem` y aplica las opciones
    * correspondientes según el tipo de recompensa.
    *
    * Para ítems de tipo equipamiento o piedra:
    * - Asigna el nivel de mejora (`upgradeLv`) configurado.
    * - Actualiza sus bonus implícitos según el nuevo nivel de mejora.
    *
    * Para ítems utilitarios:
    * - Asigna la cantidad configurada.
    *
    * @param itemsConfig Configuración de los ítems que deben generarse como recompensa.
    *
    * @returns Lista de ítems finales que serán entregados al jugador.
    */
    getItemsRewards(itemsConfig: ItemsConfig[]): ItemDTO[] {
        const rewards: ItemDTO[] = []
        for (const config of itemsConfig) {
            const item = this.itemService.getCoreItemInfoByIdItem(config.idItem)
            if (config.itemOptions.type === 'equip' && (isEquipItem(item) || isPiedraItem(item))) {
                item.upgradeLv = config.itemOptions.upgradeLv
                this.itemService.getUpdatedImplicitBonus(item)
                rewards.push(item)
                continue;
            }
            if (config.itemOptions.type === 'utility' && isUtilityItem(item)) {
                item.cantidad = config.itemOptions.cantidad
                rewards.push(item)
                continue;
            }
        }
        return rewards
    }


    /**
    * Obtiene la experiencia final que debe otorgar una misión.
    *
    * Si la misión ya tiene una experiencia definida mayor a `0`, se considera
    * que ese valor fue asignado intencionalmente en la configuración de la misión
    * y se devuelve directamente.
    *
    * Si la experiencia configurada es `0`, el valor se calcula automáticamente
    * usando la experiencia total correspondiente al nivel de la misión y el
    * porcentaje configurado para ese tipo o grupo de misión.
    *
    * @param missionLv Nivel de la misión utilizado para obtener la experiencia base.
    * @param expOfMission Experiencia definida directamente en la configuración de la misión.
    * @param idMission ID de la misión utilizado para buscar su configuración de porcentaje.
    *
    * @returns Experiencia final que otorgará la misión.
    *
    * @throws Si no existe experiencia base configurada para el nivel de la misión.
    * @throws Si no existe una configuración de porcentaje asociada a la misión.
    */
    getUpdatedExp(missionLv: number, expOfMission: number, idMission: IdMissionsList): number {
        if (expOfMission > 0) {
            return expOfMission
        }
        const totalExpLv = EXP_PER_LV[missionLv]
        if (!totalExpLv) {
            throw new Error(`No se puede asignar una exp predeterminada a la mision`)
        }
        const expMissionConfig = EXP_MISSION_CONFIG.find(mission => mission.idMissions.includes(idMission))

        if (!expMissionConfig) {
            throw new Error(`No se encuentra la configuracion de la experiencia de la mission ${idMission}`)
        }

        return Math.trunc(totalExpLv * (expMissionConfig.exp / 100))
    }
}