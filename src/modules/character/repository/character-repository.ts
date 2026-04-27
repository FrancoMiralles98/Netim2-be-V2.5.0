import { Injectable, NotFoundException } from "@nestjs/common";
import { CharacterDocument, CharacterModel } from "../schema/character.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CharacterEntity } from "../entity/character-entity";
import { CharacterMapper } from "../mapper/character-mapper";
import { CharacterPersistence } from "../types/character-persistence.type";

@Injectable()
export class CharacterRepository {
    constructor(
        @InjectModel(CharacterModel.name)
        private characterModel: Model<CharacterDocument>
    ) { }

    async getCharacterByName(nombre: string): Promise<CharacterEntity> {
        const character = await this.characterModel.findOne({ nombre }).lean()
        if (!character) {
            throw new NotFoundException('character not found')
        }
        const characterPersistence = CharacterMapper.fromDb(character)
        return CharacterMapper.toDomain(characterPersistence)
    }

    async getCharacterById(id: string): Promise<CharacterEntity> {
        const character = await this.characterModel.findById(id).lean()
        if (!character) {
            throw new NotFoundException('character not found')
        }
        const characterPersistence = CharacterMapper.fromDb(character)
        return CharacterMapper.toDomain(characterPersistence)
    }

    async deleteCharacterById(id: string): Promise<CharacterModel> {
        const character = await this.characterModel.findByIdAndDelete(id)
        if (!character) {
            throw new NotFoundException('character not found')
        }
        return character
    }

    async updateCharacterById(id: string, data: CharacterPersistence): Promise<CharacterModel> {
        const updatedCharacter = await this.characterModel.findByIdAndUpdate(id, {$set: data}, {new:true})
        if (!updatedCharacter) {
            throw new NotFoundException('character not found')
        }
        return updatedCharacter
    }
}