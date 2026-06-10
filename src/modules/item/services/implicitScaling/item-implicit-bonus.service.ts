import { Injectable } from "@nestjs/common";
import { ConfiguredItemBonusCalculatorService } from "./configured-item-bonus-calculator.service";
import { RandomImplicitBonusService } from "./random-implicit-bonus.service";
import { ItemDTO } from "../../types/item-dto";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { isEquipItem, isMonturaItem, isPiedraItem } from "../../types/item-type-guard.type";


@Injectable()
export class ItemImplicitBonusService {
    constructor(
        private configuredItemBonusCalculator: ConfiguredItemBonusCalculatorService,
        private randomImplicitBonusService: RandomImplicitBonusService,
    ){}

    getUpdatedImplicits(
        item: ItemDTO | InventoryItem,
    ): ItemDTO | InventoryItem {
        if (isEquipItem(item)) {
            item.implicitBonus = this.configuredItemBonusCalculator.getConfiguredImplicitStats(item.idItem,item.upgradeLv,item.lvReq)
            item.randomImplicitBonus = this.randomImplicitBonusService.getRandomImplicitBonusValue(item.lvReq,item.randomImplicitBonus,item.upgradeLv)
        }

        if (isPiedraItem(item)) {
            item.implicitBonus = this.configuredItemBonusCalculator.getConfiguredImplicitStats(item.idItem,item.upgradeLv,1)
        }

        if (isMonturaItem(item)) {
            item.montura.implicitBonus = this.configuredItemBonusCalculator.getConfiguredImplicitStats(item.idItem,item.montura.lv,1)
        }
        
        return item
    }
}