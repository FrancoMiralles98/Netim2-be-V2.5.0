import { Body, Controller, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) { }

  @Post('create')
  async createCharacter(@Body() body: CreateCharacterDto) {
    const character = await this.characterService.createCharacter(body)
    return {data: character}
  }
}
