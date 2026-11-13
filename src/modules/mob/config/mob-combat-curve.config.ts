import type { MobCombatCurvePoint } from '../types/mobProps/mob-combat-config.type';

/** Puntos de balance ordenados por nivel. La factory interpola los niveles intermedios. */
export const MOB_COMBAT_CURVE: readonly [MobCombatCurvePoint, ...MobCombatCurvePoint[]] = [
    { level: 1, hp: 120, mana: 40, ad: { min: 25, max: 35 }, ap: { min: 15, max: 25 }, def: 2 },
    { level: 10, hp: 480, mana: 90, ad: { min: 70, max: 98 }, ap: { min: 45, max: 65 }, def: 11 },
    { level: 20, hp: 1_000, mana: 150, ad: { min: 110, max: 155 }, ap: { min: 75, max: 105 }, def: 18 },
    { level: 30, hp: 1_750, mana: 220, ad: { min: 150, max: 210 }, ap: { min: 100, max: 145 }, def: 25 },
    { level: 50, hp: 3_200, mana: 360, ad: { min: 220, max: 310 }, ap: { min: 155, max: 215 }, def: 38 },
    { level: 75, hp: 5_200, mana: 540, ad: { min: 315, max: 445 }, ap: { min: 225, max: 315 }, def: 52 },
    { level: 100, hp: 7_500, mana: 720, ad: { min: 410, max: 575 }, ap: { min: 300, max: 420 }, def: 66 },
    { level: 125, hp: 10_000, mana: 900, ad: { min: 510, max: 715 }, ap: { min: 380, max: 530 }, def: 80 },
];
