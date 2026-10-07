import { SkillAura, SkillBuff, SkillDamage, SkillHeal } from "netim2-shared";

/**
 * Se utiliza para tener la informacion mas base de la skill
 * lo demas datos se obtienen de metodos que obtiene la informacion
 * de la lista de escalados de cada skill
 */
export type SkillSummary = SkillAuraSummary | SkillDamageSummary | SkillBuffSummary | SkillHealSummary

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
    'duration' |
    'mana' |
    'tags'
>

export type SkillBuffSummary = Pick<SkillBuff,
    'type' |
    'id' |
    'description' |
    'mana' |
    'effects'
>

export type SkillHealSummary = Pick<SkillHeal,
    'type'
    | 'id'
    | 'description'
    | 'mana'
    | 'weaponRestricted'
>