import type { MobRace } from '../types/mobProps/mob-race.type';
import type { MobCombatModifier } from '../types/mobProps/mob-combat-config.type';

/** Ajustes por raza que se combinan con el perfil y el tipo de objetivo. */
export const MOB_RACE_MODIFIERS: Partial<Record<MobRace, MobCombatModifier>> = {
    oso: { multipliers: { hp: 1.1 } },
    tigre: { multipliers: { ad: 1.1 } },
    araña: { defenseBonuses: { def_veneno: 10 } },
    escorpion: { defenseBonuses: { def_veneno: 10 } },
    serpiente: { defenseBonuses: { def_veneno: 10 } },
    tortuga: { multipliers: { def: 1.15 } },
};
