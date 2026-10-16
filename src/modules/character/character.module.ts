import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './controller/character.controller';
import { CharacterEquipmentController } from './controller/character-equipment.controller';
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
import { CharacterEquipService } from './services/equip/character-equip.service';
import { CharacterEquipOrchestratorService } from './services/equip/character-equip-orchestrator.service';
import { ItemModule } from '../item/item.module';
import { CharacterInventoryController } from './controller/character-inventory.controller';
import { CharacterInventoryService } from './services/inventory/character-inventory.service';
import { CharacterInventoryOrchestratorService } from './services/inventory/character-inventory-orchestrator.service';

@Module({
  imports: [
    BonusModule,
    SharedModule,
    AuthModule,
    UserModule,
    ItemModule,
    MongooseModule.forFeature([
      { name: CharacterModel.name, schema: characterSchema }
    ])
  ],
  controllers: [CharacterController, CharacterEquipmentController, CharacterInventoryController],
  providers: [CharacterService, CharacterRepository,CharacterMapper, EquipStatsCalculatorService, CharacterAttributesService, CharacterLevelScalingService, BuffStatsCalculatorService, UpdateStatsService, CharacterEquipService, CharacterEquipOrchestratorService, CharacterBuffService, CharacterInventoryService, CharacterInventoryOrchestratorService],
  exports: [
    CharacterService,
    CharacterMapper,
    EquipStatsCalculatorService,
    CharacterAttributesService,
    CharacterLevelScalingService,
    BuffStatsCalculatorService,
    UpdateStatsService,
    CharacterBuffService,
    CharacterEquipService,
    CharacterEquipOrchestratorService,
    CharacterInventoryService,
    CharacterInventoryOrchestratorService
  ]
})
export class CharacterModule { }
