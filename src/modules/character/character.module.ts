import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModel, characterSchema } from './schema/character.schema';
import { CharacterRepository } from './repository/character-repository';
import { SharedModule } from '../shared/shared.module';
import { CharacterMapper } from './mapper/character-mapper';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: CharacterModel.name, schema: characterSchema }
    ])
  ],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository,CharacterMapper],
  exports: [
    CharacterService,
    CharacterMapper
  ]
})
export class CharacterModule { }
