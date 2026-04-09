
import { TierBonusType } from '../../types/bonusListHelper/bonus-list.type';
import { bonus6_7BonusList } from './bonus6_7';
import { tier1BonusList } from './tier1';
import { tier2BonusList } from './tier2';
import { tier3BonusList } from './tier3';
import { tier4BonusList } from './tier4';
/**
 * Mapa global que contiene todos los bonus de todos los tiers, organizados por nombre.
 *
 * @description
 * Map de todos los bonus, para busqueda mas eficiente o declarativo
 * donde cada bonus puede ser accedido por su nombre principal (primer elemento del array `name`).
 * Y el segundo argumento toda la info del bonus en cuestion
 *
 * @type {Map<string, TierBonusType>[]}
 * @returns {Map<string, TierBonusType>[]} Array de Mapas, donde cada Mapa contiene:
 *   - **Clave**: Nombre principal del bonus (ej: "Fuerza")
 *   - **Valor**: Objeto completo del bonus (TierBonusType)
 * se agrega el tier, para saber de cada bonus en que tier pertenece, ya que al hacerlo en Map
 * no se puede saber a que lista del bonus pertenece
 * aunque no es parte de un tier , tambien se agrega los bonus6_7, se asigna tier 5, para hacerse diferenciar
 */
export const allTierBonusList: Map<string, TierBonusType>[] = [
  tier1BonusList,
  tier2BonusList,
  tier3BonusList,
  tier4BonusList,
  bonus6_7BonusList,
].map((list: TierBonusType[], i: number) => {
  return new Map(
    list.map((b: TierBonusType) => [b.name[0], { ...b, tier: i + 1 }]),
  );
});
