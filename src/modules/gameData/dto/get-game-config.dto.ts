import { IsIn, IsOptional } from 'class-validator';
import type { CharacterRace, CharacterSpeciality } from 'netim2-shared';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../../character/const/statsProgress/attribute-speciality-caps.const';
import { RACE_INFO } from '../const/race-info.const';

export class GetGameConfigDto {
    @IsIn(RACE_INFO.map(info => info.raza))
    race!: CharacterRace;

    @IsOptional()
    @IsIn(Object.keys(ATTRIBUTE_SPECIALITY_CAPS))
    speciality?: CharacterSpeciality;
}
