import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import type { AuthRequest } from '../../../auth/types/request/auth-request.type';
import { ForgeOrchestratorService } from '../servicios/forge-orchestrator.service';
import { ForgeCharacterParamsDto, PreviewForgeUpgradeDto, UpgradeForgeItemDto } from '../types/forge.dto';
import type { PreviewForgeUpgradeWithFailureResponse, UpgradeForgeItemResponse } from 'netim2-shared';

/** Expone la consulta de mejora del herrero para el personaje autenticado. */
@Controller('npc/herrero/characters/:characterId')
@UseGuards(AccessTokenGuard)
export class ForgeController {
    constructor(private readonly forge: ForgeOrchestratorService) {}

    /** Ejecuta un intento y devuelve el resultado, los recursos finales y la siguiente mejora. */
    @Post('upgrade')
    @HttpCode(HttpStatus.OK)
    async upgradeItem(@Req() request: AuthRequest, @Param() params: ForgeCharacterParamsDto,
        @Body() body: UpgradeForgeItemDto): Promise<{ data: UpgradeForgeItemResponse }> {
        return { data: await this.forge.upgradeItem(params.characterId, request.user.accountId, body) };
    }

    /** Devuelve equipo mejorado, coste, materiales y probabilidades sin ejecutar la mejora. */
    @Post('preview')
    @HttpCode(HttpStatus.OK)
    async previewUpgrade(@Req() request: AuthRequest, @Param() params: ForgeCharacterParamsDto,
        @Body() body: PreviewForgeUpgradeDto): Promise<{ data: PreviewForgeUpgradeWithFailureResponse }> {
        return { data: await this.forge.previewUpgrade(params.characterId, request.user.accountId, body) };
    }
}
