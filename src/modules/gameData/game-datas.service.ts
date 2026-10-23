import { Injectable } from '@nestjs/common';
import { RACE_INFO } from './const/race-info.const';
import { GENERAL_ATTRIBUTE_CAP } from '../character/const/statsProgress/general-attribute-cap.const';
import { CharacterService } from '../character/character.service';
import { CharacterMapper } from '../character/mapper/character-mapper';
import { CharacterSelectionDataType, GameConfigResponse } from 'netim2-shared';
import { ReinosBuff } from './reinos/reinos-buff.config';
import { MAX_CHARACTERS } from './const/max-characters.const';
import { ATTRIBUTE_EFFECTS_CONFIG } from './const/attributes-config';
import { CAST_SPEED_COOLDOWN_SCALING_CONFIG, DODGE_CHANCE_PER_MOVEMENT_SPEED, SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED } from './const/bonus.const';
import { BONUS_EFFECTS_CONFIG } from '../fight/config/bonus-effects.config';
import { EQUIPMENT_SLOTS_CONFIG } from '../character/config/equip-slot.config';
import { MAX_ACTIVE_BUFF } from '../character/config/buffs.config';

@Injectable()
export class GameDatasService {
    constructor(
        private characterService: CharacterService,
        private characterMapper: CharacterMapper
    ) { }

    getGameConfig(): GameConfigResponse {
        return structuredClone({
            attributes: {
                effects: ATTRIBUTE_EFFECTS_CONFIG,
            },
            combat: {
                dodgePerMovementSpeed: DODGE_CHANCE_PER_MOVEMENT_SPEED,
                spellDodgePerMovementSpeed: SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED,
                cooldownScaling: CAST_SPEED_COOLDOWN_SCALING_CONFIG,
                bonusEffects: BONUS_EFFECTS_CONFIG,
            },
            equipment: {
                slots: [...EQUIPMENT_SLOTS_CONFIG.slots],
            },
            buff: {
                max_active_buff: MAX_ACTIVE_BUFF
            }
        });
    }

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

