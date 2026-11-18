import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FightEntity } from '../entities/fight.entity';
import type { FighterCombatEntity } from '../entities/fighter-combat.entity';

/** Construye la pelea con sus bandos e identidad de ejecución. */
@Injectable()
export class FightFactory {
    /** Valida los bandos y el límite de turnos antes de crear la pelea. */
    create(allies: FighterCombatEntity[], enemies: FighterCombatEntity[], maxTurns: number): FightEntity {
        if (!allies.length || !enemies.length) throw new Error('La pelea requiere combatientes en ambos bandos');
        if (!Number.isSafeInteger(maxTurns) || maxTurns < 1) {
            throw new Error('El límite de turnos debe ser un entero positivo');
        }
        return new FightEntity({
            allies, enemies, maxTurns, id: randomUUID(), randomSeed: randomUUID(),
        });
    }
}
