import { IsIn, IsOptional } from 'class-validator';
import type { CharacterRace, CharacterSpeciality } from 'netim2-shared';
import { CHARACTER_SPECIALITYS } from '../../character/const/character-specialitys.const';

export class GetGameConfigDto {
    @IsIn(Object.keys(CHARACTER_SPECIALITYS))
    race!: CharacterRace;

    @IsOptional()
    @IsIn([...new Set(Object.values(CHARACTER_SPECIALITYS).flat())])
    speciality?: CharacterSpeciality;
}
