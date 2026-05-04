import { BonusType } from "../../types/bonusListHelper/bonus-list.type";
import { bonus6_7BonusList } from "./bonus6_7";
import { CORRUPT_IMPLICIT_BONUS } from "./corrupt-implicit-bonus";
import { tier1BonusList } from "./tier1";
import { tier2BonusList } from "./tier2";
import { tier3BonusList } from "./tier3";
import { tier4BonusList } from "./tier4";

export const BONUS_LIST: BonusType[] = [
    ...bonus6_7BonusList,
    ...CORRUPT_IMPLICIT_BONUS,
    ...tier1BonusList,
    ...tier2BonusList,
    ...tier3BonusList,
    ...tier4BonusList,
]