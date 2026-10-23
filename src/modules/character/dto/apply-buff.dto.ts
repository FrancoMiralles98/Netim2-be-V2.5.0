import { IsNotEmpty, IsString, Matches } from 'class-validator';
import type { ApplyBuffRequest } from 'netim2-shared';

export class ApplyBuffDto implements ApplyBuffRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    itemId!: ApplyBuffRequest['itemId'];
}
