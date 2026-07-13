import { ConflictException, Injectable } from '@nestjs/common';
import { CharacterRepository } from './repository/character-repository';
import { CreateCharacterDto } from './dto/create-character.dto';
import { CharacterMapper } from './mapper/character-mapper';
import { CharacterPersistence } from './types/character-persistence.type';
import { CharacterDocument } from './schema/character.schema';

@Injectable()
export class CharacterService {
    constructor(
        private characterRepository: CharacterRepository,
        private characterMapper: CharacterMapper,
    ) { }

    async validateCharacterOwnership(characterId: string, accountId: string): Promise<boolean> {
        const character = await this.characterRepository.getCharacterById(characterId)
        return character.user_owner === accountId
    }

    async getCharactersByUserId(userId: string): Promise<CharacterDocument[]> {
        return await this.characterRepository.getCharacterByUserId(userId)
    }

    async createCharacter(createCharacterValue: CreateCharacterDto): Promise<{ character: CharacterPersistence }> {
        try {
            const baseCharacter = this.characterMapper.createCharacterToPersistence(createCharacterValue)
            const characterCreated = await this.characterRepository.createCharacter(baseCharacter)

            return { character: this.characterMapper.fromDb(characterCreated) }

        } catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new ConflictException('Ya existe un personaje con ese nombre.')
            }

            throw error
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
