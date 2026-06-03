import { Injectable } from "@nestjs/common";
import { UtilityItemDTO } from "src/modules/item/types/item-dto";
import { MobModel } from "src/modules/mob/schema/mob.schema";

@Injectable()
export class UtilityItemDropService {
    generateFinalItem(baseItem: UtilityItemDTO, mob: MobModel, rareBonusValue: number): UtilityItemDTO {

    }
}