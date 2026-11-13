import { AuraSkillValueScaling, BuffSkillValueScaling, DamageSkillValueScaling, SkillAura, SkillBuff, SkillDamage, SkillHeal,SkillScalingConfig } from "netim2-shared";

export const isSkillDamageScaling = (scaling: SkillScalingConfig): scaling is DamageSkillValueScaling => {
    return scaling.type === 'damage'
}

export const isSkillBuffScaling = (
    scaling: SkillScalingConfig): scaling is BuffSkillValueScaling => {
    return scaling.type === 'buff'
}

export const isSkillAuraScaling = (
    scaling: SkillScalingConfig): scaling is AuraSkillValueScaling => {
    return scaling.type === 'aura'
}

export const isSkillDamage = (
    skill: SkillDamage | SkillAura | SkillBuff | SkillHeal): skill is SkillDamage => {
    return skill.type === 'damage' || skill.type === 'heal'
}

export const isSkillBuff = (
    skill: SkillDamage | SkillAura | SkillBuff): skill is SkillBuff => {
    return skill.type === 'buff'
}

export const isSkillAura = (
    skill: SkillDamage | SkillAura | SkillBuff): skill is SkillAura => {
    return skill.type === 'aura'
}