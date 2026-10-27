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
import { CharacterBuffService } from './services/item-use/character-buff.service';
import { CharacterEquipService } from './services/equip/character-equip.service';
import { CharacterEquipOrchestratorService } from './services/equip/character-equip-orchestrator.service';
import { ItemModule } from '../item/item.module';
import { CharacterInventoryController } from './controller/character-inventory.controller';
import { CharacterInventoryService } from './services/inventory/character-inventory.service';
import { CharacterInventoryOrchestratorService } from './services/inventory/character-inventory-orchestrator.service';
import { CharacterPotionService } from './services/item-use/character-potion.service';
import { CharacterItemUseController } from './controller/character-item-use.controller';
import { CharacterItemUseOrchestratorService } from './services/item-use/character-item-use-orchestrator.service';
import { CharacterChestService } from './services/item-use/character-chest.service';
import { CharacterAttributeController } from './controller/character-attribute.controller';
import { CharacterAttributeService } from './services/atributos/character-attribute.service';
import { CharacterAttributeOrchestratorService } from './services/atributos/character-attribute-orchestrator.service';

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
  controllers: [CharacterController, CharacterEquipmentController, CharacterInventoryController, CharacterItemUseController, CharacterAttributeController],
  providers: [CharacterService, CharacterRepository,CharacterMapper, EquipStatsCalculatorService, CharacterAttributesService, CharacterLevelScalingService, BuffStatsCalculatorService, UpdateStatsService, CharacterEquipService, CharacterEquipOrchestratorService, CharacterBuffService, CharacterInventoryService, CharacterInventoryOrchestratorService, CharacterPotionService, CharacterItemUseOrchestratorService, CharacterChestService, CharacterAttributeService, CharacterAttributeOrchestratorService],
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
    CharacterInventoryOrchestratorService,
    CharacterPotionService,
    CharacterItemUseOrchestratorService,
    CharacterAttributeService,
    CharacterAttributeOrchestratorService
  ]
})
export class CharacterModule { }
