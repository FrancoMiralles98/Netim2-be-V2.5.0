import type { Stats } from 'netim2-shared';

/** Valores base de combate para un nivel de referencia. */
export interface MobCombatCurvePoint {
    level: number;
    hp: number;
    mana: number;
    ad: Stats['general']['ad'];
    ap: Stats['general']['ap'];
    def: number;
}

/** Estilo de combate que se puede asignar a una ficha de mob. */
export type MobCombatProfile = 'standard' | 'aggressive' | 'tank' | 'magic' | 'boss';

/** Multiplica stats base y agrega bonus acumulables. Los campos omitidos son neutros. */
export interface MobCombatModifier {
    multipliers?: Partial<Record<'hp' | 'mana' | 'ad' | 'ap' | 'def', number>>;
    extraDefense?: number;
    /** Suma valores planos después de los multiplicadores. AD y AP suman a ambos extremos, y HP y maná a su máximo. */
    generalBonuses?: Partial<Record<keyof Stats['general'], number>>;
    /** Suma bonus al grupo de daño en las unidades propias de cada stat. */
    damageBonuses?: Partial<Stats['bonus']['daño']>;
    defenseBonuses?: Partial<Stats['bonus']['defensa']>;
}

/** Sobrescribe valores finales concretos de la ficha y conserva los campos omitidos. */
export interface MobStatsOverrides {
    general?: {
        [Key in keyof Stats['general']]?: Stats['general'][Key] extends object
            ? Partial<Stats['general'][Key]>
            : Stats['general'][Key];
    };
    bonus?: { [Key in keyof Stats['bonus']]?: Partial<Stats['bonus'][Key]> };
}
