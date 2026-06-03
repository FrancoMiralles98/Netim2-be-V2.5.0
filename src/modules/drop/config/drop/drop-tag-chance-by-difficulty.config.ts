import { DropTag } from "src/modules/item/types/entities-props/item-drop.config.type";
import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type";

export const DROP_TAG_CHANCES_BY_DIFFICULTY: Record<EnemyType, Partial<Record<DropTag, number>>> = {
    'mob': { 
        equipment: 40,
        generic_utility: 30,
        special_utility: 10,
        mob_specific: 30,
    },
    'netim': { 
        generic_utility: 25,
        special_utility: 25,
    },
    'boss': { 
        equipment: 40,
        generic_utility: 15,
        special_utility: 20,
        special_drop: 5,
    },
    'raid': { 
        equipment: 25,
        generic_utility: 15,
        special_utility: 15,
        mob_specific: 20,
        special_drop: 15,
    },
}