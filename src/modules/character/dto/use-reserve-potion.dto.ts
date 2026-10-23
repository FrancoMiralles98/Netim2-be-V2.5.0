import { IsNotEmpty, IsString } from 'class-validator';
import type { UseReservePotionRequest } from 'netim2-shared';

export class UseReservePotionDto implements UseReservePotionRequest {
    @IsString()
    @IsNotEmpty()
    itemId!: UseReservePotionRequest['itemId'];
}
