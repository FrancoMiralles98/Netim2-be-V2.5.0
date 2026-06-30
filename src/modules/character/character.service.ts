import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './repository/character-repository';

@Injectable()
export class CharacterService {
    constructor(
        private characterRepository: CharacterRepository
    ) {}

    async validateCharacterOwnership(characterId: string, accountId: string): Promise<boolean> {
        const character = await this.characterRepository.getCharacterById(characterId)
        return character.user_owner === accountId
    }
}
