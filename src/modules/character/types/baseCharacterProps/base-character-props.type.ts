import { EquipType, TypeWeapon } from "src/modules/item/types/entities-props/equip.type";
import { CharacterRace, CharacterSpeciality, CharacterStats } from "./character-stats.type";
import { MonturaType } from "src/modules/item/types/entities-props/montura.type";
import { DiscoveryWorld } from "./discovery-world.type";
import { StarDiscovery } from "./stars-discovery.type";
import { ReinosNames } from "src/modules/gameData/types/reinos-names.type";
import { AppliedBuffos } from "./buffos-in-character.type";
import { EquipoOptions } from "./equipo-options.type";
import { GremioOptions } from "./gremio-options.type";
import { CharacterRole } from "./character-role.enum";
import { MissionOption } from "./mission-option.type";
import { DungeonInProgressType } from "./dungeon-in-progress.type";
import { PvpDataType } from "./pvp-data.type";
import { HistorialInUser } from "./historial-in-user.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";

/**
 *
 * @description
 * Contiene toda la información persistida del personaje, incluyendo progreso,
 * inventario, equipo, estadísticas, timers y estado general dentro del juego.
 *
 * @property {string} nombre
 * Nombre único del personaje.
 *
 * @property {DiscoveryWorld} discovery_world
 * Progreso de descubrimiento del personaje por mundo o zona.
 * @see DiscoveryWorld
 *
 * @property {StarDiscovery} stars_discovery
 * Progreso de estrellas desbloqueadas por descubrimiento de mobs.
 * @see StarDiscovery
 *
 * @property {{x: number, y: number}} icono
 * Coordenadas del icono seleccionado por el jugador.
 *
 * @property {number} timer_lv
 * Tiempo restante o requerido, en segundos, para una acción relacionada a la subida de nivel.
 *
 * @property {Date} timer_mob
 * Tiempo de espera para volver a pelear contra mobs.
 *
 * @property {Date} timer_metin
 * Tiempo de espera para volver a pelear metines.
 *
 * @property {Date} timer_pvp
 * Tiempo de espera para volver a pelear PvP.
 *
 * @property {Date} timer_boss
 * Tiempo de espera para volver a pelear bosses.
 *
 * @property {ReinosNames} reino
 * Reino al que pertenece el personaje.
 *
 * @property {'Femenino' | 'Masculino'} genero
 * Género del personaje.
 *
 * @property {number} puntos_atributos
 * Cantidad de puntos disponibles para mejorar atributos.
 *
 * @property {number} puntos_habilidad
 * Cantidad de puntos disponibles para mejorar habilidades.
 *
 * @property {AppliedBuffos[]} buffos
 * Lista de buffos activos aplicados al personaje.
 * @see AppliedBuffos
 *
 * @property {InventoryItem[]} inventario
 * Inventario general del personaje.
 * @see InventoryItem
 *
 * @property {EquipType[]} equipo_1
 * slot n°1 del equipo que puede utilizar el personaje.
 * @see {EquipType}
 * 
 * @property {EquipType[]} equipo_2
 * slot n°2 del equipo que puede utilizar el personaje.
 * @see {EquipType}
 * 
 * @property {EquipType[]} equipo_3
 * slot n°3 del equipo que puede utilizar el personaje.
 * @see {EquipType}
 * 
 * @property {EquipoOptions[]} equipo_options
 * data relacionada si tiene o no habilitado los slots de los equipo
 * 
 * @property {1 | 2 | 3} equipo_selected
 * slot actual que esta equipado
 
 * @property {number} yang
 * Cantidad de yang disponible.
 *
 * @property {string} gremio_options
 * Nombre o referencia del gremio al que pertenece el personaje.
 *
 * @property {number} lv
 * Nivel actual del personaje.
 *
 * @property {number} exp
 * Experiencia acumulada actual.
 *
 * @property {number} exp_next_lv
 * Experiencia necesaria para alcanzar el siguiente nivel.
 *
 * @property {number} atribute_per_lv
 * Cantidad de puntos de atributo obtenidos por subida de nivel.
 *
 * @property {string} img
 * Ruta, nombre o identificador de la imagen/avatar del personaje.
 *
 * @property {number} time_played
 * Tiempo total jugado acumulado, en segundos.
 *
 * @property {CharacterStats} stats
 * Estadísticas generales, bonus y datos de combate del personaje.
 * @see {CharacterStats}
 * 
 * @property {PvpDataType} pvp_data
 * Estadisticas y datos relacionados con la Arena Pvp
 * @see {PvpDataType}
 *
 * @property {HistorialInUser[]} historial
 * Historial combates realzados por el personaje.
 * @see HistorialInUser
 *
 * @property {MonturaType} montura
 * Datos de la montura equipada o disponible del personaje.
 * @see {MonturaType}
 * 
 * @property {number} montura_lv
 * nivel actual de habilidad de montura (cuanto mas alto mejores monturas podras equiparte)
 * 
 * @property {boolean} beginning
 * Valor para indentificar si es un personaje recien creado para inicializar el tutorial
 * 
  * @property {DungeonInProgressType} dungeon_in_progress
 * Datos relacionado al progreso del personaje dentro de una dungeon especifica
 * @see {DungeonInProgressType}
 */
export interface BaseCharacterProps {
    nombre: string
    discovery_world: DiscoveryWorld;
    stars_discovery: StarDiscovery[];
    timer_mob: number;
    timer_metin: number;
    timer_pvp: number;
    timer_boss: number;
    timer_lv: number;
    reino: ReinosNames
    genero: 'femenino' | 'masculino'
    puntos_atributos: number;
    puntos_habilidad: number;
    buffos: AppliedBuffos[];
    equipo_1: EquipType[];
    equipo_2: EquipType[];
    equipo_3: EquipType[];
    equipo_options: EquipoOptions;
    equipo_selected: 1 | 2 | 3;
    yang: number;
    lv: number;
    exp: number;
    exp_next_lv: number;
    atribute_per_lv: number;
    time_played: number;
    stats: CharacterStats;
    role: CharacterRole
    montura_lv: number;
    beginning: boolean;
    mission_option: MissionOption;
    dungeon_in_progress: DungeonInProgressType;
    pvp_data: PvpDataType;
    historial: HistorialInUser[];
    party: Partial<BaseCharacterProps>[]
    type_weapon: TypeWeapon | ''
    target_type: Extract<AllTargetType,"medio_humanos">;
    raza: CharacterRace;
    montura?: MonturaType;
    gremio_options?: GremioOptions;
    especialidad?: CharacterSpeciality;
}