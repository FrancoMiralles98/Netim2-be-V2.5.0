import { IdMob } from "netim2-shared";
import type { MobCoreData } from "../../types/mobProps/mob-core-data.type";

export const CITY1_MOB_LIST: MobCoreData[] = [
    {
        dificultad:1,
        discovery: 1,
        enemie_type: 'mob',
        exp: {min:10,max:25},
        hab: [],
        idMob: IdMob.PERRO_SALVAJE,
        lv: 1,
        nombre: 'Perro Salvaje',
        raza: 'perro',
        spawnConfig: {canSpawn:false},
        specific_drop: [],
        target_type: 'animales',
        ubication: 'city1',
        yang: {min:10,max:20},
        combatProfile: 'standard',
    }
]
