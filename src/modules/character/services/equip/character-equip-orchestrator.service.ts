import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BuyEquipmentSlotResponse, CharacterPersistence, EquipmentStatsResponse, EquipItemResponse, SelectEquipmentResponse, UnequipItemResponse, subTypeEquip } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterEquipService } from './character-equip.service';

@Injectable()
export class CharacterEquipOrchestratorService {
    constructor(
        private readonly characterEquipService: CharacterEquipService,
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
    ) {}

    async equipItem(characterId: string, accountId: string, itemId: string): Promise<EquipItemResponse> {
        const source = await this.validateCharacterOwnership(characterId, accountId);
        const { character, newItems } = this.characterEquipService.equipItem(source, itemId);
        const equipment = { 1: character.equipo_1, 2: character.equipo_2, 3: character.equipo_3 }[character.equipo_selected];
        const equippedItem = equipment.find(item => 'id' in item && item.id === itemId);
        if (!equippedItem || !('id' in equippedItem) || typeof equippedItem.id !== 'string') {
            throw new InternalServerErrorException('No se encuentra la instancia equipada en el resultado');
        }
        return {
            ...this.statsResponse(character),
            equipmentSlot: character.equipo_selected,
            equippedItem: { ...equippedItem, id: equippedItem.id },
            newItems,
        };
    }

    async unequipItem(characterId: string, accountId: string, subType: subTypeEquip): Promise<UnequipItemResponse> {
        const source = await this.validateCharacterOwnership(characterId, accountId);
        const { character, newItems } = this.characterEquipService.unequipItem(source, subType);
        return {
            ...this.statsResponse(character),
            equipmentSlot: character.equipo_selected,
            unequippedSlot: subType,
            newItems,
        };
    }

    async selectEquipment(characterId: string, accountId: string, slot: 1 | 2 | 3): Promise<SelectEquipmentResponse> {
        const source = await this.validateCharacterOwnership(characterId, accountId);
        const { character } = this.characterEquipService.selectEquipment(source, slot);
        return { ...this.statsResponse(character), equipo_selected: character.equipo_selected };
    }

    async buyEquipmentSlot(characterId: string, userId: string, slot: 1 | 2 | 3): Promise<BuyEquipmentSlotResponse> {
        // La compra carga y valida el personaje dentro de su transacción, sin consulta previa.
        const { response } = await this.characterEquipService.buyEquipmentSlot(characterId, userId, slot);
        return response;
    }

    private statsResponse(character: CharacterPersistence): EquipmentStatsResponse {
        return { stats: character.stats, attributes: character.atributos, type_weapon: character.type_weapon };
    }

    private async validateCharacterOwnership(characterId: string, accountId: string): Promise<CharacterPersistence> {
        const document = await this.characterRepository.getCharacterById(characterId);
        if (document.user_owner !== accountId) {
            throw new ForbiddenException('El personaje no pertenece a la cuenta');
        }
        return this.characterMapper.fromDb(document);
    }
}
