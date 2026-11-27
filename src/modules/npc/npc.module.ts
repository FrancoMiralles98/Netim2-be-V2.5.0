import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CharacterModule } from '../character/character.module';
import { ItemModule } from '../item/item.module';
import { ShopController } from './tiendas/controller/shop.controller';
import { ShopActionsService } from './tiendas/servicios/shop-actions.service';
import { ShopCatalogService } from './tiendas/servicios/shop-catalog.service';
import { ShopOrchestratorService } from './tiendas/servicios/shop-orchestrator.service';
import { ForgeActionsService } from './herrero/servicios/forge-actions.service';
import { ForgeOrchestratorService } from './herrero/servicios/forge-orchestrator.service';
import { ForgeCalculationService } from './herrero/servicios/forge-calculation.service';
import { ForgeController } from './herrero/controller/forge.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [AuthModule, CharacterModule, ItemModule, SharedModule],
    controllers: [ShopController, ForgeController],
    providers: [ShopCatalogService, ShopActionsService, ShopOrchestratorService, ForgeActionsService, ForgeOrchestratorService, ForgeCalculationService],
    exports: [ShopCatalogService, ShopActionsService, ShopOrchestratorService, ForgeActionsService, ForgeOrchestratorService],
})
export class NpcModule {}
