/**
 * Configuración utilizada para determinar el nivel final de un
 * equipamiento generado mediante drops.
 *
 * @property difficulty
 * Cuanto mas lejos esta del Itemlv maximo, mas dificultad tendra, 
 *
 * @property minDistance
 * Minima distancia del itemLv que se púede agregar al item en esta dificultad
 *
 * @property maxDistance
 * Maxima distancia del itemLv que se púede agregar al item en esta dificultad
 *
 * @property tier
 * Lista de tiers utilizados para determinar el bonus de nivel
 * que recibirá el equipamiento.
 */
export interface ItemLvRerollType {
    difficulty: number;
    minDistance: number;
    maxDistance: number;
    tier: TierReroll[]
}

/**
 * utilizado para calcular itemLv
 *
 * @property probability
 * Probabilidad de selecciónar este tier.
 *
 * @property minBonusLv
 * Bonus mínimo de nivel que puede otorgar este tier.
 *
 * @property maxBonusLv
 * Bonus máximo de nivel que puede otorgar este tier.
 */
export interface TierReroll {
    probability: number;
    minBonusLv: number;
    maxBonusLv: number;

}