import { CharacterSpeciality, SkillAuraScaling, SkillBuffScaling, SkillDamageScaling, SkillHealScaling, UNIQUE_ID_SKILLS } from "netim2-shared";

export type StructureSkillScaling =  
Partial<Record<CharacterSpeciality,Partial<Record<UNIQUE_ID_SKILLS,SkillDamageScaling | SkillAuraScaling | SkillBuffScaling | SkillHealScaling>>>>