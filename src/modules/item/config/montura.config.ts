import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type"
import { MobDifficulty } from "src/modules/mob/types/mobProps/mob-difficult.type"

export const MONTURA_RULES = {
    low_montura_max_lv: 5,
    medium_montura_max_lv: 8,
    high_montura_max_lv: 11,
    special_montura_max_lv: 1,
}

export const EXP_MONTURA_X_LV = {
    1: 50,
    2: 75,
    3: 112,
    4: 167,
    5: 250,
    6: 375,
    7: 562,
    8: 843,
    9: 1264,
    10: 1896,
    11: 2500
}

export const EXP_GAIN_PER_ENEMIE_TYPE: Record<EnemyType, number> = {
    'mob': 1,
    'netim': 3,
    'boss': 10,
    'raid': 5
}

export const EXP_BONIFICATION_PER_MOB_LV: Record<MobDifficulty, number> = {
    1: 1,
    2: 2,
    3: 3
}