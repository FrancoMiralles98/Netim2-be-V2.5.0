import { Injectable, NotFoundException } from "@nestjs/common";
import { CharacterDocument, CharacterModel } from "../schema/character.schema";
import { ClientSession, Model } from "mongoose";
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

    async createCharacter(props: Partial<CharacterModel>, userId: string, session?: ClientSession): Promise<CharacterDocument> {
        const character = new this.characterModel({
            ...props,
            user_owner: userId,
        });

        return character.save({ session });
    }

    async getCharacterByName(nombre: string): Promise<CharacterEntity> {
        const character = await this.characterModel.findOne({ nombre }).lean()
        if (!character) {
            throw new NotFoundException('character not found')
        }
        const characterPersistence = this.characterMapper.fromDb(character)
        return this.characterMapper.toDomain(characterPersistence)
    }

    async getCharacterById(id: string): Promise<CharacterDocument> {  
        const character = await this.characterModel.findById(id)
        if (!character) {
            throw new NotFoundException('character not found')
        }
        return character
    }

    async getCharacterByUserId(userId: string): Promise<CharacterDocument[]> {
        return await this.characterModel.find({ user_owner: userId })
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