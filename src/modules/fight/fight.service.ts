import { Injectable } from '@nestjs/common';
import type { FightResponse } from 'netim2-shared';
import { FightEngine } from './engine/fight-engine';
import type { FighterCombatEntity } from './entities/fighter-combat.entity';

/** Ejecuta combates con los bandos preparados por el contexto que inicia la pelea. */
@Injectable()
export class FightService {
    constructor(private readonly fightEngine: FightEngine) {}

    /** Ejecuta una pelea y devuelve su resultado, estadísticas y reproducción. */
    fight(allies: FighterCombatEntity[], enemies: FighterCombatEntity[], maxTurns = 500): FightResponse {
        return this.fightEngine.execute(allies, enemies, maxTurns);
    }
}
