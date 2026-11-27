import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CharacterRepository } from '../../../character/repository/character-repository';
import { CharacterMapper } from '../../../character/mapper/character-mapper';
import type { PreviewForgeUpgradeRequest, IdItemList, ForgeTargetUpgradeLv, ForgeUpgradeConfig, PreviewForgeUpgradeWithFailureResponse, UpgradeForgeItemRequest, UpgradeForgeItemResponse } from 'netim2-shared';
import { ForgeActionsService } from './forge-actions.service';

/** Autoriza las acciones del herrero y guarda costes y equipo en una sola transacción. */
@Injectable()
export class ForgeOrchestratorService {
    constructor(
        private readonly actions: ForgeActionsService,
        private readonly repository: CharacterRepository,
        private readonly mapper: CharacterMapper,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    /** Relee el personaje dentro de la transacción para impedir gastos concurrentes del mismo inventario. */
    async upgradeItem(characterId: string, accountId: string, request: UpgradeForgeItemRequest): Promise<UpgradeForgeItemResponse> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.repository.getCharacterById(characterId, session);
                if (String(document.user_owner) !== accountId) throw new ForbiddenException('El personaje no pertenece a esta cuenta');
                const result = this.actions.upgradeItem(this.mapper.fromDb(document), request);
                await this.repository.updateCharacterById(characterId, result.changes, session);
                return result.response;
            });
        } finally {
            await session.endSession();
        }
    }

    /** Comprueba propiedad y consulta la mejora sin guardar ni gastar recursos. */
    async previewUpgrade(characterId: string, accountId: string, request: PreviewForgeUpgradeRequest): Promise<PreviewForgeUpgradeWithFailureResponse> {
        const document = await this.repository.getCharacterById(characterId);
        if (String(document.user_owner) !== accountId) throw new ForbiddenException('El personaje no pertenece a esta cuenta');
        return this.actions.previewUpgrade(this.mapper.fromDb(document), request);
    }

    /** Consulta las reglas configuradas para una mejora concreta. */
    getUpgradeConfig(idItem: IdItemList, targetUpgradeLv: ForgeTargetUpgradeLv): ForgeUpgradeConfig {
        return this.actions.getUpgradeConfig(idItem, targetUpgradeLv);
    }
}
