import type { MobCombatModifier, MobCombatProfile } from '../types/mobProps/mob-combat-config.type';

/** Ajustes de HP, daño y defensa por perfil. El perfil estándar conserva la base. */
export const MOB_COMBAT_PERFIL: Record<MobCombatProfile, MobCombatModifier> = {
    standard: { damageBonuses: { daño_critico: 2 } },
    aggressive: { multipliers: { hp: 0.8, ad: 1.3 }, damageBonuses: { daño_critico: 2 } },
    tank: { multipliers: { hp: 1.4, ad: 0.8 }, extraDefense: 8, damageBonuses: { daño_critico: 2 } },
    magic: { multipliers: { hp: 0.9, ad: 0.7, ap: 1.35, mana: 1.5 }, damageBonuses: { daño_critico: 2 } },
    boss: { multipliers: { hp: 3, ad: 1.2, ap: 1.2 }, defenseBonuses: { def_hab: 5 }, damageBonuses: { daño_critico: 2 } },
};
