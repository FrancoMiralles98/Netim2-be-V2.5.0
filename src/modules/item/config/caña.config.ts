/**
 * @description- bonus de pescaSkill que da por nivel
 */
export const BONUS_X_LV = 4

/**
 * @description - exp necesaria para cada nivel de la caña
 */
export const CAÑA_EXP_X_LV = {
    1: 10,
    2: 35,
    3: 60,
    4: 85,
    5: 110,
    6: 135,
    7: 160,
    8: 185,
    9: 210,
    10: 235,
    11: 260,
    12: 285,
    13: 310,
    14: 335,
    15: 360
}

/**
 * @description - exp que se le da a la caña segun la rareza del item que se obtuvo
 */
export const EXP_X_RARITY_LIST:Record<NameOfRarity,number> = {
    comun: 1,
    inusual: 2,
    raro: 4,
    ultraRaro: 6
}

export const EXP_X_RARITY_DROP:Record<NameOfRarity,number> = {
    comun: 1,
    inusual: 2,
    raro: 4,
    ultraRaro: 6
}

export type NameOfRarity = 'comun' |'inusual' | 'raro' | 'ultraRaro'