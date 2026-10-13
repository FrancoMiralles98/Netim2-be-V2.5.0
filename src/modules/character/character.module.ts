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
import { EquipStatsCalculatorService } from './services/stats/calculator/equip-stats-calculator.service';
import { CharacterAttributesService } from './services/stats/calculator/character-attributes.service';
import { CharacterLevelScalingService } from './services/stats/calculator/character-level-scaling.service';
import { BuffStatsCalculatorService } from './services/stats/calculator/buff-stats-calculator.service';
import { UpdateStatsService } from './services/stats/update-stats.service';
import { BonusModule } from '../bonus/bonus.module';
import { CharacterBuffService } from './services/buffos/character-buff.service';

@Module({
  imports: [
    BonusModule,
    SharedModule,
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: CharacterModel.name, schema: characterSchema }
    ])
  ],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository,CharacterMapper, EquipStatsCalculatorService, CharacterAttributesService, CharacterLevelScalingService, BuffStatsCalculatorService, UpdateStatsService, CharacterBuffService],
  exports: [
    CharacterService,
    CharacterMapper,
    EquipStatsCalculatorService,
    CharacterAttributesService,
    CharacterLevelScalingService,
    BuffStatsCalculatorService,
    UpdateStatsService,
    CharacterBuffService
  ]
})
export class CharacterModule { }
