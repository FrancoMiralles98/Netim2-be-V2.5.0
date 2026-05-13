import { CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { UNIQUE_ID_SKILLS } from "../props/unique-id-skill.enum";
import { SkillDamageEscalado } from "./skill-damage-escalado.type";
import { SkillAuraEscalado } from "./skill-aura-escalado.type";



/**
 * Estrucutura de las (config) listas de escalados de las skills para las clases 
 */
export type StructureCharacterSkillScaling = SpecialitySkillsScaling

export type SpecialitySkillsScaling = Partial<Record<CharacterSpeciality,DescriptionScaling>>

export type DescriptionScaling = Partial<Record<UNIQUE_ID_SKILLS,SkillDamageEscalado|SkillAuraEscalado>>