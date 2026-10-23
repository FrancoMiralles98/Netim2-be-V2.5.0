import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { isDeepStrictEqual } from 'node:util';
import type { CharacterPersistence, QuickHealRequest, QuickHealResponse, UsePotionRequest, UsePotionResponse, UseReservePotionRequest, UseReservePotionResponse } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterPotionService } from './character-potion.service';
import { ItemService } from '../../../item/item.service';
import { CharacterBuffService } from './character-buff.service';
import type { ApplyBuffRequest, ApplyBuffResponse, RefreshBuffsResponse } from 'netim2-shared';
import { CharacterChestService } from './character-chest.service';
import type { OpenChestRequest, OpenChestResponse } from 'netim2-shared';
import type { OpenChestBulkRequest, OpenChestBulkResponse } from 'netim2-shared';

type ItemUseChanges = Partial<CharacterPersistence> & {
    'stats.general.hp.actual'?: number;
    'stats.general.mana.actual'?: number;
};

@Injectable()
export class CharacterItemUseOrchestratorService {
    constructor(
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        private readonly characterPotionService: CharacterPotionService,
        @InjectConnection() private readonly connection: Connection,
        private readonly itemService: ItemService,
        private readonly characterBuffService: CharacterBuffService,
        private readonly characterChestService: CharacterChestService,
    ) {}

    usePotion(characterId: string, accountId: string, request: UsePotionRequest): Promise<UsePotionResponse> {
        return this.execute(characterId, accountId, character => this.characterPotionService.usePotion(character, request));
    }

    useReservePotion(characterId: string, accountId: string, request: UseReservePotionRequest): Promise<UseReservePotionResponse> {
        return this.execute(characterId, accountId, character => this.characterPotionService.useReservePotion(character, request));
    }

    quickHeal(characterId: string, accountId: string, request: QuickHealRequest): Promise<QuickHealResponse> {
        return this.execute(characterId, accountId, character => this.characterPotionService.quickHeal(character, request.resources));
    }

    applyBuff(characterId: string, accountId: string, request: ApplyBuffRequest): Promise<ApplyBuffResponse> {
        return this.execute(characterId, accountId, character => this.characterBuffService.applyBuff(character, request), true);
    }

    refreshBuffs(characterId: string, accountId: string): Promise<RefreshBuffsResponse> {
        return this.execute(characterId, accountId, character => this.characterBuffService.refreshBuffs(character), true);
    }

    openChest(characterId: string, accountId: string, request: OpenChestRequest): Promise<OpenChestResponse> {
        return this.executeChest(characterId, accountId, character => this.characterChestService.openChest(character, request));
    }

    openChestBulk(characterId: string, accountId: string, request: OpenChestBulkRequest): Promise<OpenChestBulkResponse> {
        return this.executeChest(characterId, accountId, character => this.characterChestService.openChestBulk(character, request));
    }

    /** Inventario, yang y progreso del lote se confirman juntos. */
    private async executeChest<T extends OpenChestResponse>(characterId: string, accountId: string,
        action: (character: CharacterPersistence) => { character: CharacterPersistence; response: T }): Promise<T> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const source = this.characterMapper.fromDb(document);
                const result = action(source);
                const changes: Partial<CharacterPersistence> = { inventario: result.character.inventario, yang: result.character.yang };
                if (result.response.progress) {
                    Object.assign(changes, result.response.progress, { stats: result.character.stats,
                        atributos: result.character.atributos, buffos: result.character.buffos });
                }
                await this.characterRepository.updateCharacterById(characterId, changes, session);
                return result.response;
            });
        } finally {
            await session.endSession();
        }
    }

    /** Una sola lectura por intento; valida, calcula y persiste bajo la misma transacción. */
    private async execute<T>(characterId: string, accountId: string,
        action: (character: CharacterPersistence) => { character: CharacterPersistence; response: T },
        persistFullStats = false): Promise<T> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) {
                    throw new ForbiddenException('El personaje no pertenece a la cuenta');
                }
                const source = this.characterMapper.fromDb(document);
                const prepared = structuredClone(source);
                // La hidratación recupera el contrato del catálogo y conserva el saldo guardado.
                prepared.inventario = prepared.inventario.map(item =>
                    item.type === 'utility' && item.type_utility === 'poción' &&
                    item.potionType === 'reserve' && item.resource === undefined
                        ? this.itemService.getUpdatedInventoryItem(item)
                        : item);
                const result = action(prepared);
                const changes: ItemUseChanges = {};
                if (!isDeepStrictEqual(source.inventario, result.character.inventario)) {
                    changes.inventario = result.character.inventario;
                }
                if (persistFullStats) {
                    if (!isDeepStrictEqual(source.stats, result.character.stats)) changes.stats = result.character.stats;
                    if (!isDeepStrictEqual(source.atributos, result.character.atributos)) changes.atributos = result.character.atributos;
                    if (!isDeepStrictEqual(source.buffos, result.character.buffos)) changes.buffos = result.character.buffos;
                } else {
                    for (const resource of ['hp', 'mana'] as const) {
                        if (source.stats.general[resource].actual !== result.character.stats.general[resource].actual) {
                            changes[`stats.general.${resource}.actual`] = result.character.stats.general[resource].actual;
                        }
                    }
                }
                if (Object.keys(changes).length > 0) {
                    await this.characterRepository.updateCharacterById(characterId, changes, session);
                }
                return result.response;
            });
        } finally {
            await session.endSession();
        }
    }
}
