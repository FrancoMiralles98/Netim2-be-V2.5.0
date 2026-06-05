import { DropWeightType } from "src/modules/drop/types/drop-weight.type";

export interface ItemDropConfig {
    source: ItemSource[];
    drop_tag: DropTag[],
    mobLv: { min: number, max: number },
    levelScaling?: {
        startLv: number,
        maxBonusLv: number,
        maxMultiplier: number,
    },
    quantity?: {
        min: number
        max: number,
        scaleWithMobLv: boolean
    }
    weight: DropWeightType
}

export type DropTag =
    | 'generic_utility'
    | 'special_utility'
    | 'mob_specific'
    | 'equipment'
    | 'special_drop'
    | 'corrupt_drop'

export type ItemSource =
    | 'mob_drop'
    | 'netim_drop'
    | 'boss_drop'
    | 'raid_drop'
    | 'event'
    | 'quest'
    | 'crafting'
    | 'fishing'
    | 'shop'
    | 'chest'