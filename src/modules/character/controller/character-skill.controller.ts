import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { GetCharacterSpecialitySkillsDto } from '../dto/get-character-speciality-skills.dto';
import { CharacterSkillOrchestratorService } from '../services/skill/character-skill-orchestrator.service';
import type { GetCharacterSpecialitySkillsResponse } from 'netim2-shared';

@Controller('character/:id/skills')
@UseGuards(AccessTokenGuard)
export class CharacterSkillController {
    constructor(private readonly characterSkillService: CharacterSkillOrchestratorService) {}

    @Post('speciality-preview')
    @HttpCode(HttpStatus.OK)
    async getSpecialitySkills(@Req() request: AuthRequest, @Param('id') characterId: string,
        @Body() body: GetCharacterSpecialitySkillsDto): Promise<{ data: GetCharacterSpecialitySkillsResponse }> {
        return { data: await this.characterSkillService.getSpecialitySkills(characterId, request.user.accountId, body) };
    }
}
