import { UbicationNames } from "src/modules/gameData/types/ubication-names.type";
import { SpawnConfig } from "./spawn-config.type";
import { MobStats } from "./mob-stats.type";
import { DropsChance } from "./drop-chance.type";
import { GenericDrop } from "./generic-drop.type";
import { SpecificDrop } from "./specific-drop.type";
import { IdMobList } from "../id-mob-list.enum";

export interface MobType {
    nombre: string;
    lv: number;
    img: string;
    ubication: UbicationNames;
    dificultad: 1 | 2 | 3 | 4;
    spawnConfig: SpawnConfig
    idMob: IdMobList;
    yang: {min: number, max: number};
    exp: {min: number, max: number};
    stats: MobStats
    dropChance: DropsChance;
    genericDrop:GenericDrop;
    specificDrop: SpecificDrop;
    quantityDrop: number;
    discovery: number;
}

