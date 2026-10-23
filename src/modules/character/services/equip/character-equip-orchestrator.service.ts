import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BuyEquipmentSlotResponse, CharacterPersistence, EquipmentStatsResponse, EquipItemResponse, SelectEquipmentResponse, UnequipItemResponse, subTypeEquip } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterEquipService } from './character-equip.service';
import { isDeepStrictEqual } from 'node:util';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class CharacterEquipOrchestratorService {
    constructor(
        private readonly characterEquipService: CharacterEquipService,
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async equipItem(characterId: string, accountId: string, itemId: string): Promise<EquipItemResponse> {
        return this.withCharacterTransaction(characterId, accountId, async (source, session) => {
            const { character, newItems } = this.characterEquipService.equipItem(source, itemId);
            const equipment = { 1: character.equipo_1, 2: character.equipo_2, 3: character.equipo_3 }[character.equipo_selected];
            const equippedItem = equipment.find(item => 'id' in item && item.id === itemId);
            if (!equippedItem || !('id' in equippedItem) || typeof equippedItem.id !== 'string') {
                throw new InternalServerErrorException('No se encuentra la instancia equipada en el resultado');
            }
            await this.persistEquipmentChanges(characterId, source, character, session);
            return {
                ...this.statsResponse(character),
                equipmentSlot: character.equipo_selected,
                equippedItem: { ...equippedItem, id: equippedItem.id },
                newItems,
            };
        });
    }

    async unequipItem(characterId: string, accountId: string, subType: subTypeEquip): Promise<UnequipItemResponse> {
        return this.withCharacterTransaction(characterId, accountId, async (source, session) => {
            const { character, newItems } = this.characterEquipService.unequipItem(source, subType);
            await this.persistEquipmentChanges(characterId, source, character, session);
            return {
                ...this.statsResponse(character),
                equipmentSlot: character.equipo_selected,
                unequippedSlot: subType,
                newItems,
            };
        });
    }

    async selectEquipment(characterId: string, accountId: string, slot: 1 | 2 | 3): Promise<SelectEquipmentResponse> {
        return this.withCharacterTransaction(characterId, accountId, async (source, session) => {
            const { character } = this.characterEquipService.selectEquipment(source, slot);
            await this.persistEquipmentChanges(characterId, source, character, session);
            return { ...this.statsResponse(character), equipo_selected: character.equipo_selected };
        });
    }

    async buyEquipmentSlot(characterId: string, userId: string, slot: 1 | 2 | 3): Promise<BuyEquipmentSlotResponse> {
        try {
            // La compra carga y valida el personaje dentro de su transacción, sin consulta previa.
            const { response } = await this.characterEquipService.buyEquipmentSlot(characterId, userId, slot);
            return response;

        } catch (error) {
            console.log(error);
            throw new Error('')
        }
    }

    private async persistEquipmentChanges(
        characterId: string,
        source: CharacterPersistence,
        character: CharacterPersistence,
        session: ClientSession,
    ): Promise<void> {
        const fields = [
            'inventario', 'equipo_1', 'equipo_2', 'equipo_3',
            'equipo_selected', 'stats', 'atributos', 'type_weapon',
        ] as const;
        const changes: Partial<CharacterPersistence> = Object.fromEntries(
            fields
                .filter(field => !isDeepStrictEqual(
                    structuredClone(source[field]), structuredClone(character[field]),
                ))
                .map(field => [field, character[field]]),
        );
        // Inventario, equipo y valores derivados se guardan juntos en un único $set.
        if (Object.keys(changes).length > 0) {
            await this.characterRepository.updateCharacterById(characterId, changes, session);
        }
    }

    private statsResponse(character: CharacterPersistence): EquipmentStatsResponse {
        return { stats: character.stats, attributes: character.atributos, type_weapon: character.type_weapon };
    }

    private async withCharacterTransaction<T>(
        characterId: string,
        accountId: string,
        action: (character: CharacterPersistence, session: ClientSession) => Promise<T>,
    ): Promise<T> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) {
                    throw new ForbiddenException('El personaje no pertenece a la cuenta');
                }
                return action(this.characterMapper.fromDb(document), session);
            });
        } finally {
            await session.endSession();
        }
    }
}
