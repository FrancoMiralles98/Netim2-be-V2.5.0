import { Injectable } from "@nestjs/common";
import { ConfiguredItemBonusCalculatorService } from "./configured-item-bonus-calculator.service";
import { RandomImplicitBonusService } from "./random-implicit-bonus.service";
import { isEquipItem, isMonturaItem, isPiedraItem } from "../../types/item-type-guard.type";
import { InventoryItem, ItemDTO } from "netim2-shared";


@Injectable()
export class ItemImplicitBonusService {
    constructor(
        private configuredItemBonusCalculator: ConfiguredItemBonusCalculatorService,
        private randomImplicitBonusService: RandomImplicitBonusService,
    ){}

    /**
     * Actualiza los bonus implícitos de un ítem según su tipo.
     *
     * Para equipos, recalcula tanto los bonus implícitos configurados como los
     * bonus implícitos aleatorios. Para piedras y monturas, recalcula únicamente
     * los bonus implícitos configurados correspondientes.
     *
     * @param item Ítem base o ítem de inventario a actualizar.
     *
     * @returns El mismo ítem recibido, con sus bonus implícitos actualizados si corresponde.
     */
    getUpdatedImplicits(
        item: ItemDTO | InventoryItem,
    ): ItemDTO | InventoryItem {
        if (isEquipItem(item)) {
            item.implicitBonus = this.configuredItemBonusCalculator.getConfiguredImplicitStats(item.idItem,item.upgradeLv,item.lvReq)
            item.randomImplicitBonus = this.randomImplicitBonusService.getUpdatedRandomImplicitBonus(item.lvReq,item.randomImplicitBonus,item.upgradeLv)
            return item
        }

        if (isPiedraItem(item)) {
            item.implicitBonus = this.configuredItemBonusCalculator.getConfiguredImplicitStats(item.idItem,item.upgradeLv,1)
            return item
        }

        if (isMonturaItem(item)) {
            item.montura.implicitBonus = this.configuredItemBonusCalculator.getConfiguredImplicitStats(item.idItem,item.montura.lv,1)
            return item
        }
        
        return item
    }
}