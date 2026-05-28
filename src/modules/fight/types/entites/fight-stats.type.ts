import { BonusCCRefKeys, BonusDañoRefKeys, BonusDefensaRefKeys, BonusMiscsRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";

export interface FightStats {
  general: {
    hp: {actual:number, max: number};
    regen_hp: number;
    def: number;
    vh: number;
    va: number;
    vm: number;
    ad: { min: number, max: number };
    ap: { min: number, max: number };
  };
  bonus: {
    daño: Record<BonusDañoRefKeys, number>
    defensa: Record<BonusDefensaRefKeys, number>
    cc: Record<BonusCCRefKeys, number>;
    miscs: Record<BonusMiscsRefKeys, number>
  }
}