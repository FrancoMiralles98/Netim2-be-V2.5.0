import { IdMobList } from "../id-mob-list.enum";
import { MobType } from "./mob.type";

/**
 * Configuración de spawn de mobs.
 *
 * Define si un mob puede generar otros mobs, cuáles puede generar
 * y los que se generaron
 *
 * @property canSpawn - Indica si este mob tiene la capacidad de spawnear otros mobs.
 *
 * @property spawnMobIds - Lista de IDs de mobs que este mob puede generar.
 * Estos IDs se utilizan como referencia para crear las instancias correspondientes.
 *
 * @property mobsSpawned - Instancias de mobs generadas
 *
 * @property spawnCount - Cantidad de mobs que se generarán en el spawn.
 */
export interface SpawnConfig {
    canSpawn: boolean;
    spawnMobIds: IdMobList[];
    mobsSpawned: MobType[];
    spawnCount: number;
}