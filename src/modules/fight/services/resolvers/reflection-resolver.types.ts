import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export interface ReflectionResult {
    source: FighterCombatEntity;
    target: FighterCombatEntity;

    damage: number;

    damageType: 'true';
    delivery: 'reflected';

    chance: number;
    roll: boolean;
}