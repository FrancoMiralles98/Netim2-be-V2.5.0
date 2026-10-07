import { AttributesRefKeys, CharacterRace, CharacterSpeciality } from "netim2-shared";

/**
 * @description Configuración enviada al cliente para la creación de personajes
 * de una raza determinada.
 *
 * @property {CharacterRace} raza Raza a la que pertenece la configuración.
 * @property {CharacterStatsSpeciality} especialidades.base Configuración base
 * de los límites de atributos de la raza.
 * @property {Partial<Record<CharacterSpeciality, CharacterStatsSpeciality>>}
 * Configuracion de los limites maximos de cada especialidades de la raza
 */
export interface RaceInfo {
    raza: CharacterRace;
    especialidades: {
        base: CharacterStatsSpeciality;
    } & Partial<Record<CharacterSpeciality, CharacterStatsSpeciality>>;
}

export interface CharacterStatsSpeciality {
    statsLimit: StatsLimit;
}

export type StatsLimit = Record<AttributesRefKeys, number>;
