import { IsIn } from 'class-validator';
import type { IncreaseCharacterAttributeRequest } from 'netim2-shared';

export class IncreaseCharacterAttributeDto implements IncreaseCharacterAttributeRequest {
    @IsIn(['STR', 'INT', 'DEX', 'VIT'])
    attribute!: IncreaseCharacterAttributeRequest['attribute'];
}
