import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { ClaimHistoryRewardsRequest } from 'netim2-shared';
import { HistorialService } from '../../../historial/historial.service';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import type { ClaimCharacterHistoryRewardsResponse } from '../../types/claim-character-history-rewards-response.type';
import { CharacterHistorialService } from './character-historial.service';

/** Coordina el reclamo y confirma inventario e historial en una misma transacción. */
@Injectable()
export class CharacterHistorialOrchestratorService {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly mapper: CharacterMapper,
        private readonly histories: HistorialService,
        private readonly actions: CharacterHistorialService,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    /** Verifica propiedad, pendientes y capacidad antes de guardar el lote completo. */
    async claimRewards(characterId: string, accountId: string,
        request: ClaimHistoryRewardsRequest): Promise<ClaimCharacterHistoryRewardsResponse> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.repository.getCharacterById(characterId, session);
                if (String(document.user_owner) !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const prepared = await this.histories.prepareRewards(request, characterId, session);
                const result = this.actions.claimRewards(this.mapper.fromDb(document), prepared);
                await this.repository.updateCharacterById(characterId, { inventario: result.inventario }, session);
                const history = await this.histories.confirmRewards(request, characterId, session);
                return { ...history, ...result.changes };
            });
        } finally {
            await session.endSession();
        }
    }
}
