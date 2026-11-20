import type { Stats } from 'netim2-shared';
import { DODGE_CHANCE_PER_MOVEMENT_SPEED, SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED } from '../../gameData/const/bonus.const';

/** Suma a las stats de trabajo la esquiva derivada de su velocidad de movimiento. */
export function applyMovementSpeedDodge(stats: Stats): void {
    const movementSpeed = Math.max(0, stats.general.vm);
    stats.bonus.defensa.esquivar_ataques += movementSpeed * DODGE_CHANCE_PER_MOVEMENT_SPEED;
    stats.bonus.defensa.esquivar_hechizos += movementSpeed * SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED;
}
