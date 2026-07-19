import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CharacterRepository } from './repository/character-repository';
import { CreateCharacterDto } from './dto/create-character.dto';
import { CharacterMapper } from './mapper/character-mapper';
import { CharacterDocument } from './schema/character.schema';
import { CharacterSummary } from 'netim2-shared';
import { UserService } from '../user/user.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CharacterService {
    constructor(
        private characterRepository: CharacterRepository,
        private characterMapper: CharacterMapper,
        private userService: UserService,
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    async validateCharacterOwnership(characterId: string, accountId: string): Promise<boolean> {
        const character = await this.characterRepository.getCharacterById(characterId)
        return character.user_owner === accountId
    }

    async getCharactersByUserId(userId: string): Promise<CharacterDocument[]> {
        return await this.characterRepository.getCharacterByUserId(userId)
    }

    async deleteCharacter(userId: string, characterId: string) {
        const character = await this.characterRepository.getCharacterById(characterId)
        if (!character) {
            throw new NotFoundException('No se encuentra el personaje a eliminar.')
        }
        if (character.user_owner !== userId) {
            throw new ConflictException('No tienes permiso para eliminar este personaje.')
        }
        await this.characterRepository.deleteCharacterById(characterId)
    }

    /**
    * Crea un personaje para una cuenta autenticada.
    *
    * Si la cuenta todavía no tiene un reino asignado, utiliza el reino recibido
    * en el DTO y lo asigna a la cuenta antes de crear el personaje.
    *
    * Si la cuenta ya tiene un reino, valida que el reino recibido coincida con el
    * reino de la cuenta y crea el personaje usando siempre el reino final de la
    * cuenta.
    *
    * @param dto Datos necesarios para crear el personaje.
    * @param userId Identificador de la cuenta propietaria del personaje.
    *
    * @returns Objeto con el resumen del personaje creado.
    *
    */
    async createCharacter(
        dto: CreateCharacterDto,
        userId: string,
    ): Promise<{ character: CharacterSummary }> {
        try {
            const user = (await this.userService.getUserById(userId)).toPrimitives();

            const reinoFinal = user.reino ?? dto.reino;

            if (!reinoFinal) {
                throw new BadRequestException('Debes seleccionar un reino para crear el personaje.');
            }

            if (user.reino && dto.reino && user.reino !== dto.reino) {
                throw new BadRequestException('El reino seleccionado no coincide con el reino de la cuenta.');
            }

            if (!user.reino) {
                await this.userService.asignReinoToAccount(userId, reinoFinal);
            }

            const baseCharacter = this.characterMapper.createCharacterToPersistence({
                ...dto,
                reino: reinoFinal,
            });

            const characterCreated = await this.characterRepository.createCharacter(
                baseCharacter,
                userId,
            );

            return {
                character: this.characterMapper.toSummary(characterCreated),
            };
        } catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new ConflictException('Ya existe un personaje con ese nombre.');
            }

            throw error;
        }
    }


    private isDuplicateKeyError(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000
        )
    }
}
