import { CharacterSpeciality , UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillDamageScaling } from "./scaling/damage/skill-damage-scaling.type";
import { SkillAuraScaling } from "./scaling/aura/skill-aura-scaling.type";
import { SkillBuffScaling } from "./scaling/buff/skill-buff-scaling.type";
import { SkillHealScaling } from "./scaling/heal/skill-heal-scaling.types";

export type StructureSkillScaling =  
Partial<Record<CharacterSpeciality,Partial<Record<UNIQUE_ID_SKILLS,SkillDamageScaling | SkillAuraScaling | SkillBuffScaling | SkillHealScaling>>>>