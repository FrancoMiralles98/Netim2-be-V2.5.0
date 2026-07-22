import { CharacterSpeciality, SkillAuraScaling, SkillDamageScaling, UNIQUE_ID_SKILLS } from "netim2-shared";

export type StructureSkillScaling =  
Partial<Record<CharacterSpeciality,Partial<Record<UNIQUE_ID_SKILLS,SkillDamageScaling | SkillAuraScaling>>>>