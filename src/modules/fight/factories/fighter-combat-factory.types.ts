import { AllTargetType, CharacterRace, FightConfig, SkillType, Stats } from "netim2-shared";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";

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