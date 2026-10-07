import { IsIn, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ReinosNames } from "src/modules/gameData/reinos/reinos-names.type";
import { CharacterCreationValues, CharacterRace } from "netim2-shared";

export class CreateCharacterDto implements CharacterCreationValues {

    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    @MaxLength(13, { message: 'El nombre puede tener como máximo 13 caracteres.' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'El personaje contiene caracteres invalidos.' })
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