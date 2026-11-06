import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { GetCharacterSpecialitySkillsDto } from '../dto/get-character-speciality-skills.dto';
import { CharacterSkillOrchestratorService } from '../services/skill/character-skill-orchestrator.service';
import type { GetCharacterSpecialitySkillsResponse, SelectCharacterSpecialityResponse } from 'netim2-shared';
import { SelectCharacterSpecialityDto } from '../dto/select-character-speciality.dto';
import { GetSkillUpgradePreviewDto } from '../dto/get-skill-upgrade-preview.dto';
import type { GetSkillUpgradePreviewResponse } from 'netim2-shared';
import type { UpgradeCharacterSkillResponse } from '../types/upgrade-character-skill.types';

@Controller('character/:id/skills')
@UseGuards(AccessTokenGuard)
export class CharacterSkillController {
    constructor(private readonly characterSkillService: CharacterSkillOrchestratorService) {}

    @Post('upgrade-preview')
    @HttpCode(HttpStatus.OK)
    async getUpgradePreview(@Req() request: AuthRequest, @Param('id') characterId: string,
        @Body() body: GetSkillUpgradePreviewDto): Promise<{ data: GetSkillUpgradePreviewResponse }> {
        return { data: await this.characterSkillService.getUpgradePreview(characterId, request.user.accountId, body) };
    }

    @Post('upgrade')
    @HttpCode(HttpStatus.OK)
    async upgradeSkill(@Req() request: AuthRequest, @Param('id') characterId: string,
        @Body() body: GetSkillUpgradePreviewDto): Promise<{ data: UpgradeCharacterSkillResponse }> {
        return { data: await this.characterSkillService.upgradeSkill(characterId, request.user.accountId, body) };
    }

    @Post('speciality-preview')
    @HttpCode(HttpStatus.OK)
    async getSpecialitySkills(@Req() request: AuthRequest, @Param('id') characterId: string,
        @Body() body: GetCharacterSpecialitySkillsDto): Promise<{ data: GetCharacterSpecialitySkillsResponse }> {
        return { data: await this.characterSkillService.getSpecialitySkills(characterId, request.user.accountId, body) };
    }

    @Post('select-speciality')
    @HttpCode(HttpStatus.OK)
    async selectSpeciality(@Req() request: AuthRequest, @Param('id') characterId: string,
        @Body() body: SelectCharacterSpecialityDto): Promise<{ data: SelectCharacterSpecialityResponse }> {
        return { data: await this.characterSkillService.selectSpeciality(characterId, request.user.accountId, body) };
    }
}
