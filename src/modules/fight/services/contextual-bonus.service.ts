import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { DamageTag, DamageType, SkillDamage } from "netim2-shared";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";
import { PreparedSkillDamageComponent } from "./damage-calculator.types";

@Injectable()
export class ContextualBonusService {

    getPossibleSkillBonusMultiplier(
        attacker: FighterCombatEntity,
        target: FighterCombatEntity,
        skill: SkillDamage
    ): number {
        let multiplier = 1

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
        let mitigationPorcent = 0

        return (
            mitigationPorcent +
            this.getWeaponDefenseBonus(target,dmgType) +
            this.getSkillDmgTypeDefenseBonus(target,dmgType) +
            this.getRaceTypeDefenseBonus(target,attacker) +
            target.effectiveStats.bonus.defensa.def_hab
        )
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