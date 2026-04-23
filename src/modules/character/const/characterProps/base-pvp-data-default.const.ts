import { PvpDataType } from "../../types/baseCharacterProps/pvp-data.type";

export const BASE_PVP_DATA: PvpDataType = {
    battledCharacters: [],
    equip_selected: 1,
    lp: 0,
    remainingLosses: 0,
    totalLosses: 0,
    lastEquipUpdated: Date.now(),
    totalWins: 0,
    claimYang: 0
}