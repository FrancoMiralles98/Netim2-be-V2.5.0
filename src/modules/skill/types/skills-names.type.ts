import { LetterMasteryLv, UNIQUE_ID_SKILLS } from "netim2-shared";

export type SkillNamesByGrade = Record<LetterMasteryLv | 'N', string>;

export type SkillsNames = Partial<
    Record<UNIQUE_ID_SKILLS, SkillNamesByGrade>
>;