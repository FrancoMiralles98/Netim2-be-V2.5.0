import { IdItem, type NpcShopId, type ShopItemConfig } from 'netim2-shared';

export const GENERAL_SHOP_ITEMS: ShopItemConfig[] = [
    { idItem: IdItem.BRAZALETE_DE_MADERA, price: 100, },
    { idItem: IdItem.COLLAR_DE_MADERA, price: 100, },
    { idItem: IdItem.PENDIENTES_DE_MADERA, price: 100, },
    { idItem: IdItem.ZAPATILLAS_DE_CUERO, price: 100, },
    { idItem: IdItem.POCION_ROJA_P, price: 100, },
    { idItem: IdItem.POCION_ROJA_M, price: 200, },
    { idItem: IdItem.POCION_ROJA_G, price: 300, },

];
export const WEAPONS_SHOP_ITEMS: ShopItemConfig[] = [
    { idItem: IdItem.ESPADA_LARGA, price: 100, },
    { idItem: IdItem.ESPADA_DE_BAMBU, price: 100, },
    { idItem: IdItem.ESPADA_DE_PLATA, price: 100, },
    { idItem: IdItem.ESPADA_BASTARDA, price: 100, },
    { idItem: IdItem.ARCO_LARGO, price: 100, },
    { idItem: IdItem.ARCO_DE_BATALLA, price: 100, },
    { idItem: IdItem.ARCO_DE_BAT_DE_MONTA, price: 100, },
    { idItem: IdItem.ARCO_RUINA_NEGRA, price: 100, },
    { idItem: IdItem.LANZA, price: 100, },
    { idItem: IdItem.LANZA_ARANA, price: 100, },
    { idItem: IdItem.GUADANA_DE_GUERRA, price: 100, },
    { idItem: IdItem.HALBERD, price: 100, },
    { idItem: IdItem.AMIJA, price: 100, },
    { idItem: IdItem.NUEVE_HOJAS, price: 100, },
    { idItem: IdItem.CUCHILLO_CORTO, price: 100, },
    { idItem: IdItem.DAGA_MORDISCO_DE_GATO, price: 100, },
    { idItem: IdItem.CAMPANA_DE_PLATA, price: 100, },
    { idItem: IdItem.CAMPANA_DE_JADE, price: 100, },
    { idItem: IdItem.FAN_DE_HIERRO, price: 100, },
    { idItem: IdItem.FAN_ALA_GRULLA, price: 100, },
    { idItem: IdItem.FAN_ACUATICO, price: 100, },
];
export const ARMORS_SHOP_ITEMS: ShopItemConfig[] = [
    { idItem: IdItem.ARMADURA_DE_MONJE, price: 100, },
    { idItem: IdItem.ARMADURA_PLACAS_DE_TIGRE, price: 100, },
    { idItem: IdItem.ARMADURA_PLACAS_DE_LEON, price: 100, },
    { idItem: IdItem.TRAJE_AZUL, price: 100, },
    { idItem: IdItem.TRAJE_CARMESI, price: 100, },
    { idItem: IdItem.TRAJE_DE_HORMIGA_ROJA, price: 100, },
    { idItem: IdItem.ARMADURA_PLACAS_REQUIEM, price: 100, },
    { idItem: IdItem.ARMADURA_DE_DESGRACIA, price: 100, },
    { idItem: IdItem.ARMADURA_PLACAS_FANTASMA, price: 100, },
    { idItem: IdItem.ROPAJE_AZUL, price: 100, },
    { idItem: IdItem.ROPAJE_ROSA, price: 100, },
    { idItem: IdItem.ROPAJE_AMOROSO, price: 100, },
    { idItem: IdItem.SOMBRERO_DE_MONJE, price: 100, },
    { idItem: IdItem.CASCO_TRADICIONAL, price: 100, },
    { idItem: IdItem.CAPUCHA_DE_CUERO, price: 100, },
    { idItem: IdItem.YELMO_SANGRIENTO, price: 100, },
    { idItem: IdItem.ESCUDO_DE_BATALLA, price: 100, },
];
export const STABLE_SHOP_ITEMS: ShopItemConfig[] = [];
export const FISHING_SHOP_ITEMS: ShopItemConfig[] = [];

/** Catálogos por tienda. price es el precio unitario que cobra el NPC. */
export const NPC_SHOP_ITEMS: Record<NpcShopId, ShopItemConfig[]> = {
    general: GENERAL_SHOP_ITEMS,
    weapons: WEAPONS_SHOP_ITEMS,
    armors: ARMORS_SHOP_ITEMS,
    stable: STABLE_SHOP_ITEMS,
    fishing: FISHING_SHOP_ITEMS,
};
