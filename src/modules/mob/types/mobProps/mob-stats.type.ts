import { BonusCCRefKeys, BonusDañoRefKeys, BonusDefensaRefKeys } from "netim2-shared";

export interface MobStats {
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
    cc: Record<BonusCCRefKeys, number>
  }
}