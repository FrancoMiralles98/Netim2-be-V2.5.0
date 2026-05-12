import { LetterMasteryLv } from "./letter-mastery-lv.type";
import { UNIQUE_ID_SKILLS } from "./unique-id-skill.enum";

export type SkillsNamesType = Partial<Record<UNIQUE_ID_SKILLS,NamesByTierMasteryLv>>

export type NamesByTierMasteryLv  = Record<LetterMasteryLv | 'N',string>
