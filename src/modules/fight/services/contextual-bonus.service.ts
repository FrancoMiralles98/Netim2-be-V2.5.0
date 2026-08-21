import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { DamageType, SkillDamage, StatusEffectsKeys, TypeWeapon } from "netim2-shared";
import { ActiveStatusEffectId } from "../types/statusEffects/active-status-effect.types";
import { DODGE_CHANCE_PER_MOVEMENT_SPEED } from "src/modules/shared/config/character-stats.config";
import { LIMIT_BONUS_CONFIG } from "src/modules/bonus/config/limit-bonus.config";

@Injectable()
export class ContextualBonusService {

    getBasicAttackStatusEffectsChances(target: FighterCombatEntity): Record<ActiveStatusEffectId, number> {
        return {
            desmayo: target.getEffectiveStatValue('bonus.cc.desmayo'),
            retardo: target.getEffectiveStatValue('bonus.cc.retardo'),
            electrico: target.getEffectiveStatValue('bonus.daño.electrico'),
            incendio: target.getEffectiveStatValue('bonus.daño.incendio'),
            sangrado: target.getEffectiveStatValue('bonus.daño.sangrado'),
            veneno: target.getEffectiveStatValue('bonus.daño.veneno'),
            corta_curacion: target.getEffectiveStatValue('bonus.defensa.corta_curacion')
        }
    }

    getSkillLifeSteal(target: FighterCombatEntity) {
        return target.getEffectiveStatValue('bonus.defensa.vampirismo_hechizo')
    }

    getBasicAttackLifeSteal(target: FighterCombatEntity) {
        return target.getEffectiveStatValue('bonus.defensa.robo_vida')
    }

    getPenetracionChance(target: FighterCombatEntity): number {
        return target.effectiveStats.bonus.daño.penetracion
    }

    getDodgeChance(target: FighterCombatEntity): number {
        const mv = target.effectiveStats.general.vm
        return Math.min(LIMIT_BONUS_CONFIG.esquivar_ataques ?? 100,
            mv * DODGE_CHANCE_PER_MOVEMENT_SPEED)
    }

    getBlockChance(target: FighterCombatEntity): number {
        return target.effectiveStats.bonus.defensa.bloquear_ataques
    }

    getPossibleStatusEffectMitigationPercent(target: FighterCombatEntity, effectId: ActiveStatusEffectId): number {
        return (target.effectiveStats.bonus.defensa[`def_${effectId}`] ?? 0)
    }

    getResistanceBonusByEffectId(target: FighterCombatEntity, effectId: ActiveStatusEffectId): number {
        return target.effectiveStats.bonus.defensa[`def_${effectId}`] ?? 0
    }

    getPossibleBasicAttakBonusMultiplier(
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
    ): number {
        let multiplier = 0

        return (
            multiplier +
            this.getTargetTypeDamageBonus(attacker, target) +
            this.getRaceDamageBonus(attacker, target) +
            attacker.effectiveStats.bonus.daño.media
        )
    }

    getPossibleSkillBonusMultiplier(
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        skill: SkillDamage
    ): number {
        let multiplier = 1

        return (
            multiplier + (
                (this.getTargetTypeDamageBonus(attacker, target) +
                    this.getRaceDamageBonus(attacker, target) +
                    attacker.effectiveStats.bonus.daño.habilidad) /
                100
            )
        )
    }

    getPossibbleSkillBonusMitigationPorcent(
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        dmgType: DamageType
    ): number {

        let generalMitigationPercent = this.getWeaponDefenseBonus(target, dmgType, attacker.weaponType) +
            this.getSkillDmgTypeDefenseBonus(target, dmgType) +
            target.effectiveStats.bonus.defensa.def_hab +
            target.effectiveStats.bonus.defensa.damage_taken


        const finalMitigationPercent =
            (
                1 -
                (1 - generalMitigationPercent / 100) *
                (1 - this.getRaceTypeDefenseBonus(target, attacker) / 100)
            ) * 100;

        return finalMitigationPercent
    }

    getPossibbleBasicAttackBonusMitigationPorcent(
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        dmgType: DamageType
    ): number {
        let generalMitigationPercent = this.getWeaponDefenseBonus(target, dmgType, attacker.weaponType) +
            target.effectiveStats.bonus.defensa.def_media + target.effectiveStats.bonus.defensa.damage_taken

        const finalMitigationPercent =
            (
                1 -
                (1 - generalMitigationPercent / 100) *
                (1 - this.getRaceTypeDefenseBonus(target, attacker) / 100)
            ) * 100;


        return finalMitigationPercent
    }

    private getWeaponDefenseBonus(target: FighterCombatEntity, dmgType: DamageType, attackerWeapon?: TypeWeapon): number {
        if (!attackerWeapon || dmgType === 'ap' || dmgType === 'true') return 0
        return target.effectiveStats.bonus.defensa[`def_${attackerWeapon}`] ?? 0
    }

    private getSkillDmgTypeDefenseBonus(target: FighterCombatEntity, damageType?: DamageType): number {
        if (damageType === 'true' || damageType === 'ad') return 0
        return target.effectiveStats.bonus.defensa.def_magia ?? 0
    }

    private getRaceTypeDefenseBonus(target: FighterCombatEntity, attacker: FighterCombatEntity): number {
        if (!attacker.race) return 0
        return target.effectiveStats.bonus.defensa[`def_${attacker.race}`] ?? 0
    }

    private getTargetTypeDamageBonus(attacker: FighterCombatEntity, target: FighterCombatEntity): number {
        return attacker.effectiveStats.bonus.daño[target.targetType] ?? 0
    }

    private getRaceDamageBonus(attacker: FighterCombatEntity, target: FighterCombatEntity): number {
        return target.race
            ? attacker.effectiveStats.bonus.daño[target.race]
            : 0
    }
}