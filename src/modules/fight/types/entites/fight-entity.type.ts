import { SkillType } from "src/modules/skill/types/const/skill.type";
import { FightStats } from "./fight-stats.type";
import { FightDetails } from "./fight-details.type";
import { CharacterRace } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { MobRace } from "src/modules/mob/types/mobProps/mob-race.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";
import { SpawnConfig } from "src/modules/mob/types/mobProps/spawn-config.type";

export interface FighterType {
    stats: FightStats,
    hab: SkillType[],
    fight_details: FightDetails,
    nombre: string,
    raza: CharacterRace | MobRace
    target_type: AllTargetType
    type_weapon: TypeWeapon | ''
    spawnConfig?: SpawnConfig
    effects: FighterEffectDescription
}


export interface FighterEffectDescription {
    veneno: DmgEffectDescription;
    incendio: DmgEffectDescription;
    sangrado: DmgEffectDescription;
    desmayo: CcEffectDescription;
    retardo: CcEffectDescription;
    doble_golpe: boolean;
}

export interface DmgEffectDescription extends BasicEffectDescription {
    dmgOfEffect: number;
    type: 'damage'
}

export interface CcEffectDescription extends BasicEffectDescription {
    type: 'cc'
}

export interface BasicEffectDescription {
    isActive: boolean;
    turnsRemaining: number;
}