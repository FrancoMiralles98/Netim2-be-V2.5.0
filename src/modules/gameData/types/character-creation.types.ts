import { CharacterAttribute, CharacterRace, CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";

export interface CharacterCreationConfig {
    raza: CharacterRace;
    especialidades: {
        base: CharacterStatsSpeciality;
    } & Partial<Record<CharacterSpeciality, CharacterStatsSpeciality>>;
}

export interface CharacterStatsSpeciality {
    statsLimit: StatsLimit;
}

export type StatsLimit = Record<CharacterAttribute, number>;
