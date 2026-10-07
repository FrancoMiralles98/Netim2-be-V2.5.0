import { AllTargetType, CharacterRace, FightConfig, SkillType, Stats, TypeWeapon } from "netim2-shared";

export interface FighterCombatCreationInput {
    id: string;
    name: string;

    targetType: AllTargetType;
    fightConfig: FightConfig

    weaponType?: TypeWeapon;
    race?: CharacterRace;

    stats: Stats;

    skills: SkillType[];
}