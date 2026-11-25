import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { GetHistorialResponse, HistorialDetalle, PartialHistorialDetalle } from 'netim2-shared';
import { CharacterModel } from '../../character/schema/character.schema';
import { HistorialService } from '../historial.service';

/** Autoriza las consultas de historial sobre personajes de la cuenta autenticada. */
@Injectable()
export class HistorialQueryService {
    constructor(
        @InjectModel(CharacterModel.name) private readonly characters: Model<CharacterModel>,
        private readonly historiales: HistorialService,
    ) {}

    /** Lista resúmenes después de comprobar la propiedad del personaje. */
    async getPartialsHistoriales(characterId: string, accountId: string,
        filtro?: HistorialDetalle['filtro']): Promise<PartialHistorialDetalle[]> {
        await this.validateOwnership(characterId, accountId);
        return this.historiales.getPartialsHistoriales(characterId, filtro);
    }

    /** Consulta un detalle perteneciente al personaje de la cuenta. */
    async getHistorialById(historialId: string, characterId: string, accountId: string): Promise<GetHistorialResponse> {
        await this.validateOwnership(characterId, accountId);
        return this.historiales.getHistorialById(historialId, characterId);
    }

    /** Lee únicamente el propietario para autorizar el acceso sin cargar el personaje completo. */
    private async validateOwnership(characterId: string, accountId: string): Promise<void> {
        const character = await this.characters.findById(characterId).select('user_owner').lean();
        if (!character) throw new NotFoundException('character not found');
        if (String(character.user_owner) !== accountId) {
            throw new ForbiddenException('El personaje no pertenece a esta cuenta');
        }
    }
}
