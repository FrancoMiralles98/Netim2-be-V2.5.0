import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BuyEquipmentSlotResponse, CharacterPersistence, InventoryChangeResult, InventoryItem, subTypeEquip } from "netim2-shared";
import { CharacterMapper } from "../../mapper/character-mapper";
import { CharacterRepository } from "../../repository/character-repository";
import { UserService } from "../../../user/user.service";
import { EQUIPMENT_SLOTS_CONFIG } from "../../config/equip-slot.config";
import { UpdateStatsService } from "../stats/update-stats.service";
import { ItemService } from "../../../item/item.service";

export type CharacterEquipmentResult = {
    newItems: InventoryItem[];
    updatedItems: InventoryChangeResult[];
    character: CharacterPersistence;
};

export type CharacterEquipmentPurchaseResult = {
    character: CharacterPersistence;
    response: BuyEquipmentSlotResponse;
};

@Injectable()
export class CharacterEquipService {
    constructor(
        private readonly characterMapper: CharacterMapper,
        private readonly characterRepository: CharacterRepository,
        private readonly userService: UserService,
        @InjectConnection() private readonly connection: Connection,
        private readonly updateStatsService: UpdateStatsService,
        private readonly itemService: ItemService,
    ) { }

    /** Devuelve los datos actualizados; el consumidor debe persistir inventario y equipo juntos. */
    equipItem(character: CharacterPersistence, itemId: string): CharacterEquipmentResult {
        const prepared = this.prepareEquipment(character);
        prepared.inventario = prepared.inventario.map(item =>
            item.id === itemId && item.type === 'equip'
                ? this.itemService.getUpdatedInventoryItem(item)
                : item,
        );
        const entity = this.characterMapper.toDomain(prepared);
        const inventoryChanges = entity.equipItemFromInventory(itemId);
        return {
            character: this.updateEquipmentStats(this.characterMapper.toPersistence(entity)),
            ...inventoryChanges,
        };
    }

    unequipItem(character: CharacterPersistence, subType: subTypeEquip): CharacterEquipmentResult {
        const entity = this.characterMapper.toDomain(this.prepareEquipment(character));
        const inventoryChanges = entity.unequipItemToInventory(subType);
        return {
            character: this.updateEquipmentStats(this.characterMapper.toPersistence(entity)),
            ...inventoryChanges,
        };
    }

    /** Devuelve una copia con el set solicitado activo; el consumidor debe persistir el resultado. */
    selectEquipment(character: CharacterPersistence, slot: 1 | 2 | 3): CharacterEquipmentResult {
        const entity = this.characterMapper.toDomain(this.prepareEquipment(character, slot));
        entity.selectEquipment(slot);
        return {
            character: this.updateEquipmentStats(this.characterMapper.toPersistence(entity)),
            newItems: [],
            updatedItems: [],
        };
    }

    private prepareEquipment(character: CharacterPersistence, slot = character.equipo_selected): CharacterPersistence {
        const prepared = structuredClone(character);
        const key = ({ 1: 'equipo_1', 2: 'equipo_2', 3: 'equipo_3' } as const)[slot];
        // La entidad conserva la validación de slots inválidos o bloqueados.
        if (key) {
            prepared[key] = prepared[key].map(item => this.itemService.getUpdatedEquipmentItem(item));
        }
        return prepared;
    }

    private updateEquipmentStats(character: CharacterPersistence): CharacterPersistence {
        const equipment = {
            1: character.equipo_1,
            2: character.equipo_2,
            3: character.equipo_3,
        }[character.equipo_selected];
        const { stats, attributes } = this.updateStatsService.updateStats(
            character.stats,
            character.raza,
            equipment,
            character.atributos,
            character.buffos,
            character.lv,
            character.especialidad,
        );
        character.stats = stats;
        character.atributos = attributes
        return character;
    }

    /** userId debe proceder de la cuenta autenticada. Cobra y habilita el slot en una sola transacción. */
    async buyEquipmentSlot(characterId: string, userId: string, slot: 1 | 2 | 3): Promise<CharacterEquipmentPurchaseResult> {
        const config = EQUIPMENT_SLOTS_CONFIG.slots.find(entry => entry.slot === slot);
        if (!config) throw new BadRequestException('Slot de equipo inválido');
        if (!Number.isFinite(config.cost) || config.cost < 0) {
            throw new BadRequestException('El precio del slot no es válido');
        }
        const keys = { 1: 'equipo1_on', 2: 'equipo2_on', 3: 'equipo3_on' } as const;
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== userId) {
                    throw new ForbiddenException('El personaje no pertenece a la cuenta');
                }
                const character = this.characterMapper.fromDb(document);
                if (character.equipo_options[keys[slot]]) {
                    throw new ConflictException('El slot de equipo ya está desbloqueado');
                }
                const entity = this.characterMapper.toDomain(structuredClone(character));
                let response: BuyEquipmentSlotResponse;
                if (config.currency === 'yang') {
                    if (!Number.isFinite(character.yang) || character.yang < config.cost) {
                        throw new BadRequestException('Yang insuficiente para comprar el slot');
                    }
                    entity.removeYang(config.cost);
                    response = { slot, currency: 'yang', yang: entity.toPrimitives().yang };
                } else {
                    const user = await this.userService.getUserById(userId, session);
                    const md = user.toPrimitives().md;
                    if (!Number.isFinite(md) || md < config.cost) {
                        throw new BadRequestException('MD insuficiente para comprar el slot');
                    }
                    user.extractMd(config.cost);
                    const finalMd = user.toPrimitives().md;
                    await this.userService.updateUserDataById(userId, { md: finalMd }, session);
                    response = { slot, currency: 'md', md: finalMd };
                }
                entity.unlockEquipmentSlot(slot);
                const result = this.characterMapper.toPersistence(entity);
                await this.characterRepository.updateCharacterById(characterId, result, session);
                return { character: result, response };
            });
        } finally {
            await session.endSession();
        }
    }
}
