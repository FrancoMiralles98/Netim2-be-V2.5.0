import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModel, characterSchema } from './schema/character.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:CharacterModel.name, schema: characterSchema}
    ])
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [
    CharacterService
  ]
})
export class CharacterModule {}
