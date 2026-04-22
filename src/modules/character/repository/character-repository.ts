import { Injectable } from "@nestjs/common";
import { CharacterDocument, CharacterModel } from "../schema/character.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CharacterRepository {
    constructor(
        @InjectModel(CharacterModel.name)
        private characterModel: Model<CharacterDocument>
    ){}

    
    
}