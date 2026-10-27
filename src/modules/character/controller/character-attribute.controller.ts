import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { IncreaseCharacterAttributeDto } from '../dto/increase-character-attribute.dto';
import { CharacterAttributeOrchestratorService } from '../services/atributos/character-attribute-orchestrator.service';
import type { IncreaseCharacterAttributeResponse } from 'netim2-shared';

@Controller('character/:id/attributes')
@UseGuards(AccessTokenGuard)
export class CharacterAttributeController {
    constructor(private readonly attributeService: CharacterAttributeOrchestratorService) {}

    @Post('increase')
    @HttpCode(HttpStatus.OK)
    async increaseAttribute(@Req() request: AuthRequest, @Param('id') characterId: string,
        @Body() body: IncreaseCharacterAttributeDto): Promise<{ data: IncreaseCharacterAttributeResponse }> {
        return { data: await this.attributeService.increaseAttribute(characterId, request.user.accountId, body) };
    }
}
