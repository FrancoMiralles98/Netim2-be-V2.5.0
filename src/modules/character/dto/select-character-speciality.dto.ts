import { IsIn } from 'class-validator';
import { CHARACTER_SPECIALITYS } from '../const/character-specialitys.const';
import type { SelectCharacterSpecialityRequest } from 'netim2-shared';

export class SelectCharacterSpecialityDto implements SelectCharacterSpecialityRequest {
    @IsIn([...new Set(Object.values(CHARACTER_SPECIALITYS).flat())])
    speciality!: SelectCharacterSpecialityRequest['speciality'];
}
