import { BonusCCRefKeys, BonusDañoRefKeys, BonusDefensaRefKeys, BonusMiscsRefKeys } from "netim2-shared";


export interface FighterBaseStats {
    general: {
        hp: {
            actual: number;
            max: number;
        };
        mana: {
            actual: number;
            max: number;
        };

        regenHp: number;
        regenMana: number;

        def: number;
        vh: number;
        va: number;
        vm: number;

        ad: DamageRange;
        ap: DamageRange;
    };

    bonus: {
        daño: Record<BonusDañoRefKeys, number>;
        defensa: Record<BonusDefensaRefKeys, number>;
        cc: Record<BonusCCRefKeys, number>;
        miscs: Record<BonusMiscsRefKeys, number>;
    };
}

export interface DamageRange {
    min: number;
    max: number;
}

