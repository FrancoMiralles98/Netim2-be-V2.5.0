import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AuthRequest } from '../auth/types/request/auth-request.type';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('character')
@UseGuards(AccessTokenGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) { }

  @Get(':id')
  async getCharacter(@Req() req: AuthRequest, @Param('id') characterId: string) {
    const character = await this.characterService.getCharacterById(characterId, req.user.accountId)
    return { data: character }
  }

  @Post('create')
  async createCharacter(@Req() req: AuthRequest, @Body() body: CreateCharacterDto) {
    const { character } = await this.characterService.createCharacter(body, req.user.accountId)
    return { data: character }
  }

  @Delete('delete/:id')
  async deleteCharacter(@Req() req: AuthRequest, @Param('id') characterId: string) {
    await this.characterService.deleteCharacter(req.user.accountId, characterId)
    return { data: true }
  }
}
