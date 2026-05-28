import { FighterEffectDescription } from "../../types/entites/fight-entity.type";

export const DEFAULT_FIGHTER_EFFECT_DESCRIPTION: FighterEffectDescription = {
    desmayo: { isActive: false, turnsRemaining: 0, type: 'cc' },
    retardo: { isActive: false, turnsRemaining: 0, type: 'cc' },
    incendio: { isActive: false, dmgOfEffect: 0, turnsRemaining: 0, type: 'damage' },
    veneno: { isActive: false, dmgOfEffect: 0, turnsRemaining: 0, type: 'damage' },
    sangrado: { isActive: false, dmgOfEffect: 0, turnsRemaining: 0, type: 'damage' },
    doble_golpe: false
}