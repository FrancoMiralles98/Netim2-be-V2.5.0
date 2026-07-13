import { Injectable, NotFoundException } from "@nestjs/common";
import { CharacterDocument, CharacterModel } from "../schema/character.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CharacterEntity } from "../entity/character-entity";
import { CharacterMapper } from "../mapper/character-mapper";
import { CharacterPersistence } from "../types/character-persistence.type";

/**
 * Repositorio encargado de acceder y modificar los datos de personajes
 * en MongoDB, basicamente un CRUD
 */
@Injectable()
export class CharacterRepository {
    constructor(
        @InjectModel(CharacterModel.name)
        private characterModel: Model<CharacterDocument>,
        private characterMapper: CharacterMapper
    ) { }

    async createCharacter(props: Partial<CharacterModel>): Promise<CharacterModel> {
        return await this.characterModel.create(props)
    }

    async getCharacterByName(nombre: string): Promise<CharacterEntity> {
        const character = await this.characterModel.findOne({ nombre }).lean()
        if (!character) {
            throw new NotFoundException('character not found')
        }
        const characterPersistence = this.characterMapper.fromDb(character)
        return this.characterMapper.toDomain(characterPersistence)
    }

    async getCharacterById(id: string): Promise<CharacterModel> {
        const character = await this.characterModel.findById(id).lean()
        if (!character) {
            throw new NotFoundException('character not found')
        }
        return character
    }

    async deleteCharacterById(id: string): Promise<CharacterModel> {
        const character = await this.characterModel.findByIdAndDelete(id)
        if (!character) {
            throw new NotFoundException('character not found')
        }
        return character
    }

    async updateCharacterById(id: string, data: CharacterPersistence): Promise<CharacterModel> {
        const updatedCharacter = await this.characterModel.findByIdAndUpdate(id, { $set: data }, { new: true })
        if (!updatedCharacter) {
            throw new NotFoundException('character not found')
        }
        return updatedCharacter
    }
}