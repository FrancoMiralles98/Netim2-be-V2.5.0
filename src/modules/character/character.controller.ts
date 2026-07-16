import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AuthRequest } from '../auth/types/request/auth-request.type';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('character')
@UseGuards(AccessTokenGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) { }

  @Post('create')
  async createCharacter(@Req() req: AuthRequest, @Body() body: CreateCharacterDto) {
    const character = await this.characterService.createCharacter(body,req.user.accountId)
    return { data: character }
  }
}
