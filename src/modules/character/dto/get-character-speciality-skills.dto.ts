import { IsIn } from 'class-validator';
import { CHARACTER_SPECIALITYS } from '../const/character-specialitys.const';
import type { GetCharacterSpecialitySkillsRequest } from 'netim2-shared';

export class GetCharacterSpecialitySkillsDto implements GetCharacterSpecialitySkillsRequest {
    @IsIn([...new Set(Object.values(CHARACTER_SPECIALITYS).flat())])
    speciality!: GetCharacterSpecialitySkillsRequest['speciality'];
}
