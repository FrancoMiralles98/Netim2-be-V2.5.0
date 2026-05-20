import { BonusCCRefKeys, BonusDañoRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"

export type DamageEffectKeys = Extract<BonusDañoRefKeys,'veneno' | 'incendio' | 'sangrado'>

export type CCffectKeys = BonusCCRefKeys