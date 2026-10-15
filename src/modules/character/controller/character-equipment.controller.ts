import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CharacterEquipOrchestratorService } from '../services/equip/character-equip-orchestrator.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { BuyEquipmentSlotDto, EquipItemDto, SelectEquipmentDto, UnequipItemDto } from '../dto/character-equipment.dto';

@Controller('character/:id/equipment')
@UseGuards(AccessTokenGuard)
export class CharacterEquipmentController {
  constructor(private readonly characterEquipOrchestratorService: CharacterEquipOrchestratorService) {}

  @Post('equip')
  async equipItem(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: EquipItemDto) {
    const data = await this.characterEquipOrchestratorService.equipItem(characterId, req.user.accountId, body.itemId);
    return { data };
  }

  @Post('unequip')
  async unequipItem(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: UnequipItemDto) {
    const data = await this.characterEquipOrchestratorService.unequipItem(characterId, req.user.accountId, body.subType);
    return { data };
  }

  @Patch('selected')
  async selectEquipment(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: SelectEquipmentDto) {
    const data = await this.characterEquipOrchestratorService.selectEquipment(characterId, req.user.accountId, body.slot);
    return { data };
  }

  @Post('slots/purchase')
  async buyEquipmentSlot(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: BuyEquipmentSlotDto) {
    const data = await this.characterEquipOrchestratorService.buyEquipmentSlot(characterId, req.user.accountId, body.slot);
    return { data };
  }

}
