import { BadRequestException, Injectable } from '@nestjs/common';
import type { CharacterPersistence } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import type { CharacterIncreaseAttributeResult, IncreaseCharacterAttributeRequest } from 'netim2-shared';
import { UpdateStatsService } from '../stats/update-stats.service';

@Injectable()
export class CharacterAttributeService {
    constructor(
        private readonly characterMapper: CharacterMapper,
        private readonly updateStatsService: UpdateStatsService,
    ) {}

    /** Usa la entidad para gastar un punto y respetar el cap de lvPoints. No persiste ni muta la entrada. */
    increaseAttribute(character: CharacterPersistence, request: IncreaseCharacterAttributeRequest): CharacterIncreaseAttributeResult {
        const attribute = request?.attribute;
        if (!['STR', 'INT', 'DEX', 'VIT'].includes(attribute)) {
            throw new BadRequestException('El atributo debe ser STR, INT, DEX o VIT');
        }
        if (!Number.isSafeInteger(character.puntos_atributos) || character.puntos_atributos <= 0) {
            throw new BadRequestException('No hay puntos de atributo disponibles');
        }
        const points = character.atributos[attribute];
        if (!points || !Number.isSafeInteger(points.lvPoints) || points.lvPoints < 0) {
            throw new BadRequestException('Los puntos base del atributo no son válidos');
        }
        const entity = this.characterMapper.toDomain(structuredClone(character));
        try {
            entity.increaseAttribute(attribute);
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No es posible aumentar el atributo');
        }
        const updated = this.characterMapper.toPersistence(entity);
        const equipment = { 1: updated.equipo_1, 2: updated.equipo_2, 3: updated.equipo_3 }[updated.equipo_selected];
        if (!equipment) throw new BadRequestException('El equipo seleccionado no es válido');
        const { stats, attributes } = this.updateStatsService.updateStats(
            updated.stats, updated.raza, equipment, updated.atributos, updated.buffos,
            updated.lv, updated.especialidad, updated.reino,
        );
        updated.stats = stats;
        updated.atributos = attributes;
        return { character: updated, response: { stats, attributes, puntos_atributos: updated.puntos_atributos } };
    }
}
