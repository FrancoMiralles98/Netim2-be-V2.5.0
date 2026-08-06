import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { DamageType, SkillDamage, StatusEffectsKeys } from "netim2-shared";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";

@Injectable()
export class ContextualBonusService {

    getBasicAttackStatusEffectsChances(target: FighterCombatEntity): Record<StatusEffectsKeys, number> {
        return {
            desmayo: target.getEffectiveStatValue('bonus.cc.desmayo'),
            retardo: target.getEffectiveStatValue('bonus.cc.retardo'),
            electrico: target.getEffectiveStatValue('bonus.daño.electrico'),
            incendio: target.getEffectiveStatValue('bonus.daño.incendio'),
            sangrado: target.getEffectiveStatValue('bonus.daño.sangrado'),
            veneno: target.getEffectiveStatValue('bonus.daño.veneno'),
        }
    }

    getPenetracionChance(target: FighterCombatEntity): number {
        return target.effectiveStats.bonus.daño.penetracion
    }

    getDodgeChance(target: FighterCombatEntity): number {
        return target.effectiveStats.bonus.defensa.esquivar_ataques
    }

    getBlockChance(target: FighterCombatEntity): number {
        return target.effectiveStats.bonus.defensa.bloquear_ataques
    }

    getPossibleStatusEffectMitigationPercent(target: FighterCombatEntity, effectId: StatusEffectsKeys): number {
        return (target.effectiveStats.bonus.defensa[`def_${effectId}`] ?? 0)
    }

    getResistanceBonusByEffectId(target: FighterCombatEntity, effectId: StatusEffectsKeys): number {
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
        let multiplier = 0

        return (
            multiplier +
            this.getTargetTypeDamageBonus(attacker, target) +
            this.getRaceDamageBonus(attacker, target) +
            attacker.effectiveStats.bonus.daño.habilidad
        )
    }

    getPossibbleSkillBonusMitigationPorcent(
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        dmgType: DamageType
    ): number {

        let generalMitigationPercent = this.getWeaponDefenseBonus(target, dmgType) +
            this.getSkillDmgTypeDefenseBonus(target, dmgType) +
            target.effectiveStats.bonus.defensa.def_hab

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
        let generalMitigationPercent = this.getWeaponDefenseBonus(target, dmgType) +
            target.effectiveStats.bonus.defensa.def_media

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