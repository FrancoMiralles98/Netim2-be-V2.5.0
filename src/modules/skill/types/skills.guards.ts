import { SkillAuraScaling, SkillBuffScaling, SkillDamageScaling } from "netim2-shared";

export const isSkillDamageScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling): scaling is SkillDamageScaling => {
    return scaling.type === 'damage' || scaling.type === 'heal'
}

export const isSkillBuffScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling): scaling is SkillBuffScaling => {
    return scaling.type === 'buff'
}

export const isSkillAuraScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling): scaling is SkillAuraScaling => {
    return scaling.type === 'aura'
}