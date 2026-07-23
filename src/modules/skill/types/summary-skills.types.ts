import { SkillAura, SkillBuff, SkillDamage } from "netim2-shared";

/**
 * Se utiliza para tener la informacion mas base de la skill
 * lo demas datos se obtienen de metodos que obtiene la informacion
 * de la lista de escalados de cada skill
 */
export type SkillSummary = SkillAuraSummary | SkillDamageSummary | SkillBuffSummary

export type SkillDamageSummary = Pick<SkillDamage,
    'type' |
    'id' |
    'description' |
    'weaponRestricted' |
    'mana'
>

export type SkillAuraSummary = Pick<SkillAura,
    'type' |
    'id' |
    'description' |
    'mana' | 
    'tags'
>

export type SkillBuffSummary = Pick<SkillBuff,
    'type' |
    'id' |
    'description' |
    'mana'
>