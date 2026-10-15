import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { BuyEquipmentSlotRequest, EquipItemRequest, SelectEquipmentRequest, UnequipItemRequest, subTypeEquip } from 'netim2-shared';

export class EquipItemDto implements EquipItemRequest {
  @IsString()
  @IsNotEmpty()
  itemId!: string;
}

export class UnequipItemDto implements UnequipItemRequest {
  @IsString()
  @IsIn(['arma', 'armadura', 'casco', 'brazalete', 'collar', 'pendiente', 'botas', 'escudo'])
  subType!: subTypeEquip;
}

export class SelectEquipmentDto implements SelectEquipmentRequest {
  @IsInt()
  @IsIn([1, 2, 3])
  slot!: 1 | 2 | 3;
}

export class BuyEquipmentSlotDto extends SelectEquipmentDto implements BuyEquipmentSlotRequest {}
