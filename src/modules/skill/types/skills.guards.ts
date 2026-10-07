import { SkillAura, SkillBuff, SkillDamage, SkillHeal } from "netim2-shared";
import { SkillDamageScaling } from "./scaling/damage/skill-damage-scaling.type";
import { SkillAuraScaling } from "./scaling/aura/skill-aura-scaling.type";
import { SkillBuffScaling } from "./scaling/buff/skill-buff-scaling.type";
import { SkillHealScaling } from "./scaling/heal/skill-heal-scaling.types";

export const isSkillDamageScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling | SkillHealScaling): scaling is SkillDamageScaling => {
    return scaling.type === 'damage'
}

export const isSkillBuffScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling | SkillHealScaling): scaling is SkillBuffScaling => {
    return scaling.type === 'buff'
}

export const isSkillAuraScaling = (
    scaling: SkillDamageScaling | SkillAuraScaling | SkillBuffScaling | SkillHealScaling): scaling is SkillAuraScaling => {
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