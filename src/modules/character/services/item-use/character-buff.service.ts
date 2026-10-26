import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { AppliedBuffos, CharacterPersistence } from 'netim2-shared';
import { MAX_ACTIVE_BUFF } from '../../config/buffs.config';
import { CharacterMapper } from '../../mapper/character-mapper';
import type { ApplyBuffRequest, CharacterApplyBuffResult, CharacterRefreshBuffsResult, RefreshBuffsResponse } from 'netim2-shared';
import { UpdateStatsService } from '../stats/update-stats.service';

@Injectable()
export class CharacterBuffService {
    constructor(
        private readonly characterMapper: CharacterMapper,
        private readonly updateStatsService: UpdateStatsService,
    ) {}

    /** buff_duration está en segundos; buff_inicialization en milisegundos. */
    removeExpiredBuffs(buffos: AppliedBuffos[], now = Date.now()): AppliedBuffos[] {
        return buffos.filter(buff => now < buff.buff_inicialization + buff.buff_duration * 1000);
    }

    applyBuff(character: CharacterPersistence, request: ApplyBuffRequest): CharacterApplyBuffResult {
        if (typeof request.itemId !== 'string' || !request.itemId.trim()) {
            throw new BadRequestException('El ID del buffo es obligatorio');
        }
        const source = structuredClone(character);
        const item = source.inventario.find(item => item.id === request.itemId);
        if (!item) throw new NotFoundException('No se encuentra el buffo en el inventario');
        if (item.type !== 'utility' || item.type_utility !== 'buff') {
            throw new BadRequestException('El item seleccionado no es un buffo');
        }
        if (!Number.isSafeInteger(item.cantidad) || item.cantidad < 1) {
            throw new BadRequestException('No hay unidades disponibles del buffo');
        }
        if (!Number.isFinite(item.lvUtility) || item.lvUtility < 0 || source.lv < item.lvUtility) {
            throw new BadRequestException('El personaje no tiene el nivel requerido para usar el buffo');
        }
        const duration = item.duration * 60; // El catálogo expresa minutos; AppliedBuffos usa segundos.
        if (!Number.isFinite(duration) || duration <= 0 || !Number.isSafeInteger(item.idBuff) || item.idBuff < 0 ||
            !Array.isArray(item.implicitBonus) || !Array.isArray(item.corruptBonus)) {
            throw new BadRequestException('La configuración del buffo no es válida');
        }
        const now = Date.now();
        source.buffos = this.removeExpiredBuffs(source.buffos, now);
        source.buffos = source.buffos.filter(buff => buff.id_buff !== item.idBuff);
        if (source.buffos.length >= MAX_ACTIVE_BUFF) {
            throw new BadRequestException(`No puedes tener más de ${MAX_ACTIVE_BUFF} buffos activos`);
        }
        const entity = this.characterMapper.toDomain(source);
        const updatedItems = entity.consumeItemsFromInventory([{ id: item.id, idItem: item.idItem, cantidad: 1 }]);
        const updated = this.characterMapper.toPersistence(entity);
        updated.buffos.push({
            id_buff: item.idBuff,
            buff_duration: duration,
            buff_base_duration: duration,
            buff_inicialization: now,
            buff_name: item.name,
            buff_description: item.description,
            implicitBonus: structuredClone(item.implicitBonus),
            corruptBonus: structuredClone(item.corruptBonus),
        });
        const response = this.recalculateStats(updated);
        return { character: updated, response: { ...response, updatedItems } };
    }

    refreshBuffs(character: CharacterPersistence): CharacterRefreshBuffsResult {
        const updated = structuredClone(character);
        updated.buffos = this.removeExpiredBuffs(updated.buffos);
        return { character: updated, response: this.recalculateStats(updated) };
    }

    private recalculateStats(character: CharacterPersistence): RefreshBuffsResponse {
        const equipment = { 1: character.equipo_1, 2: character.equipo_2, 3: character.equipo_3 }[character.equipo_selected];
        if (!equipment) throw new BadRequestException('El equipo seleccionado no es válido');
        const { stats, attributes } = this.updateStatsService.updateStats(
            character.stats, character.raza, equipment, character.atributos, character.buffos,
            character.lv, character.especialidad, character.reino,
        );
        character.stats = stats;
        character.atributos = attributes;
        return { stats, attributes, buffos: character.buffos };
    }
}
