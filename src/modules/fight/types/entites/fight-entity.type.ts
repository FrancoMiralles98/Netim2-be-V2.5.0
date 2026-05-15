import { SkillType } from "src/modules/skill/types/const/skill.type";
import { FightStats } from "./fight-stats.type";
import { FightDetails } from "./fight-details.type";
import { CharacterRace } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { MobRace } from "src/modules/mob/types/mobProps/mob-race.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";

export interface FightEntityType {
    stats: FightStats,
    hab: SkillType[],
    fight_details: FightDetails,
    nombre: string,
    raza: CharacterRace | MobRace
    target_type: AllTargetType
    type_weapon: TypeWeapon | ''
}