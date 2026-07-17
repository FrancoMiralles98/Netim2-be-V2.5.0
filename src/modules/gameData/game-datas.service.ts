import { Injectable } from '@nestjs/common';
import { RACE_INFO } from './const/race-info.const';
import { GENERAL_ATTRIBUTE_CAP } from '../character/const/statsProgress/general-attribute-cap.const';
import { CharacterService } from '../character/character.service';
import { CharacterMapper } from '../character/mapper/character-mapper';
import { CharacterSelectionDataType } from 'netim2-shared';
import { ReinosBuff } from './reinos/reinos-buff.config';
import { MAX_CHARACTERS } from './const/max-characters.const';

@Injectable()
export class GameDatasService {
    constructor(
        private characterService: CharacterService,
        private characterMapper: CharacterMapper
    ) { }

    async getCharacterSelectionData(userId: string): Promise<CharacterSelectionDataType> {
        const characters = await this.characterService.getCharactersByUserId(userId)
        const summaryCharacters = characters.map(c => this.characterMapper.toSummary(c))
        return {
            maxCharacters: MAX_CHARACTERS,
            reinoBuff: ReinosBuff,
            characters: summaryCharacters,
            races: structuredClone(RACE_INFO),
            attributeLimit: GENERAL_ATTRIBUTE_CAP
        }
    }
}

