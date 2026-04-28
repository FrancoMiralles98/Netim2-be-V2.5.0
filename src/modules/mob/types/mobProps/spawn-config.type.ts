import { MobType } from "./mob.type";

export interface SpawnConfig {
    canSpawn: boolean;
    spawnMobIds: number[];
    mobsSpawned: MobType[];
    spawnCount: number;
}