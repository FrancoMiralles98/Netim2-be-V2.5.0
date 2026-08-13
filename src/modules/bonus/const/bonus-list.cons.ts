import { BonusType } from "netim2-shared";
import { bonus6_7BonusList } from "./bonus6_7.const";
import { CORRUPT_IMPLICIT_BONUS } from "./corrupt-implicit-bonus.const";
import { tier1BonusList } from "./tier1.const";
import { tier2BonusList } from "./tier2.const";
import { tier3BonusList } from "./tier3.const";
import { tier4BonusList } from "./tier4.const";

export const BONUS_LIST: BonusType[] = [
    ...bonus6_7BonusList,
    ...CORRUPT_IMPLICIT_BONUS,
    ...tier1BonusList,
    ...tier2BonusList,
    ...tier3BonusList,
    ...tier4BonusList,
]