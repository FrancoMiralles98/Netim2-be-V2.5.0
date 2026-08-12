import { SkillAura, SkillAuraScaling, SkillBuff, SkillBuffScaling, SkillDamage, SkillDamageScaling, SkillHeal } from "netim2-shared";

export const isSkillDamageScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling | SkillHeal): scaling is SkillDamageScaling => {
    return scaling.type === 'damage'
}

export const isSkillBuffScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling): scaling is SkillBuffScaling => {
    return scaling.type === 'buff'
}

export const isSkillAuraScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling): scaling is SkillAuraScaling => {
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