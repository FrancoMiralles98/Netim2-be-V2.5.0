import { UbicationNames } from "src/modules/gameData/types/ubication-names.type";
import { SpawnConfig } from "./spawn-config.type";
import { MobStats } from "./mob-stats.type";
import { IdMobList } from "../id-mob-list.enum";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { MobRace } from "./mob-race.type";
import { DropConfig } from "./drop-config.type";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";

/**
 * Representa la estructura completa de un mob
 *
 * Importante:
 * Esta es la versión FINAL del mob (ya procesada por la factory).
 *
 * @property nombre - Nombre del mob.
 *
 * @property lv - Nivel del mob.
 *
 * @property img - Ruta de la imagen del mob.
 *
 * @property ubication - Ubicación donde aparece el mob.
 *
 * @property dificultad - Nivel de dificultad del mob (1 a 4).
 * nivel 1 y 2: mobs normales, lo unico que varia es son la stats y los drops
   nivel 3: son los netims
   nivel 4: jefes de zona
 *
 * @property spawnConfig - Configuración de spawn de otros mobs.
 *
 * @property idMob - Identificador único del mob.
 *
 * @property yang - Rango de recompensa de moneda (mínimo y máximo).
 *
 * @property exp - Rango de experiencia otorgada (mínimo y máximo).
 *
 * @property stats - Estadísticas completas del mob 
 *
 * @property hab - Lista de habilidades del mob.
 *
 * @property raza - Raza del mob
 *
 * @property target_type - Tipo de enemigo 
 *
 * @property especialidad - Especialización del mob (usan las mismas que los personajes)
 *
 * @property dropChance - Probabilidades de drop dependiendo de su rareza
 *
 * @property genericDrop - Lista de drops genéricos posibles.
 *
 * @property specificDrop - Drops específicos únicos de este mob.
 *
 * @property quantityDrop - Cantidad de ítems que puede dropear.
 *
 * @property discovery - nivel de descubrimiento del mob.
 *
 * @see MobCoreData
 * @see MobStats
 * @see SpawnConfig
 */
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
    stats: MobStats;
    hab: SkillType[];
    raza: MobRace;
    target_type: AllTargetType;
    especialidad: CharacterSpeciality;
    type_weapon: TypeWeapon;
    drop_config: DropConfig;
    discovery: number;
}

