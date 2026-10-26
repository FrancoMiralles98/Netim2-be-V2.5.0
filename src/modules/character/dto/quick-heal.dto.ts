import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn } from 'class-validator';
import type { QuickHealRequest } from 'netim2-shared';

export class QuickHealDto implements QuickHealRequest {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsIn(['hp', 'mana'], { each: true })
    resources!: QuickHealRequest['resources'];
}
