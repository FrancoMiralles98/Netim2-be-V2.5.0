import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { FightCharacterMobRequest } from 'netim2-shared';
import { HistorialService } from '../../../historial/historial.service';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import type { CharacterFightResultResponse } from 'netim2-shared';
import { CharacterFightService } from './character-fight.service';

/** Coordina la pelea y su liquidación sobre el personaje autenticado. */
@Injectable()
export class CharacterFightOrchestratorService {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly mapper: CharacterMapper,
        private readonly fights: CharacterFightService,
        private readonly histories: HistorialService,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    /** Confirma timer, recursos finales, EXP, yang e historial en la misma transacción. */
    async fightMob(characterId: string, accountId: string, request: FightCharacterMobRequest): Promise<CharacterFightResultResponse> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.repository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const result = this.fights.fightMob({ ...this.mapper.fromDb(document), id: characterId }, request);
                await this.repository.updateCharacterById(characterId, result.response.character, session);
                const history = await this.histories.saveHistorial(result.historial, characterId, session);
                return { ...result.response, historialId: history.id };
            });
        } finally {
            await session.endSession();
        }
    }
}
