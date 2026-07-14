import { IsIn, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { CharacterRace } from "../types/baseCharacterProps/character-stats.type";
import { ReinosNames } from "src/modules/gameData/reinos/reinos-names.type";

export class CreateCharacterDto {

    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    @MaxLength(13, { message: 'El nombre puede tener como máximo 13 caracteres.' })
    @Matches(/^[a-zA-Z-0-9]+$/, { message: 'El username contiene caracteres invalidos.' })
    nombre!: string

    @IsString()
    @IsIn(["chaman", "ninja", "guerrero", "sura"])
    raza!: CharacterRace

    @IsString()
    @IsIn(['shinsoo', 'jinno', 'chunjo'])
    reino!: ReinosNames

    @IsString()
    @IsIn(['femenino', 'masculino'])
    genero!: 'femenino' | 'masculino'

}