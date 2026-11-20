import type { AllTargetType } from '../../gameData/types/all-races.type';
import type { MobCombatModifier } from '../types/mobProps/mob-combat-config.type';

/** Ajustes comunes a todos los mobs de un tipo de objetivo. */
export const MOB_TARGET_MODIFIERS: Record<AllTargetType, MobCombatModifier> = {
    medio_humanos: {},
    orcos: { multipliers: { hp: 1.1 } },
    animales: {},
    misticos: { multipliers: { ap: 1.1, mana: 1.1 } },
    demonios: { defenseBonuses: { def_incendio: 5 } },
    monstruos: {},
};
