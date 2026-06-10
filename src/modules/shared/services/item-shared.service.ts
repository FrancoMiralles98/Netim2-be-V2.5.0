import { Injectable } from "@nestjs/common";
import { itemsList } from "src/modules/item/const/items.const";
import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type";

@Injectable()
export class ItemSharedService {
    getBaseItemInfo (idItem: IdItemList) {
        const item = itemsList.find(i=> i.idItem === idItem)

        if (!item) {
            throw new Error (`item not found: ${idItem}`)
        }

        return item
    }
}