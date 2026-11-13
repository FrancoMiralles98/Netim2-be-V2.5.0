import { CharacterSpeciality , SkillScalingConfig, UNIQUE_ID_SKILLS } from "netim2-shared";

export type StructureSkillScaling =  
Partial<Record<CharacterSpeciality,Partial<Record<UNIQUE_ID_SKILLS,SkillScalingConfig>>>>