import { UNIQUE_ID_SKILLS } from "netim2-shared";

export interface HealingStatistics {
    byBasicAttack: number; // robo de vida
    bySkill: BySkillStatistics[] //skills de curaciones, vampirismo de hechizo
    prevented: number; //negada al enemigo
    hpRegenerated: number; //unicamente a la regen Hp
}

export interface BySkillStatistics {
    amount: number;
    idSkill: UNIQUE_ID_SKILLS
}