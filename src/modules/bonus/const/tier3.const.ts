import { ValueBonusType } from "../types/bonus-in-item.type";
import { allFullNameBonusList } from "../types/bonusListHelper/bonus-list-full-name.enum";
import { BonusType } from "../types/bonusListHelper/bonus.type";


export const tier3BonusList: BonusType[] = [
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.VELOCIDAD_DE_ATAQUE,
      bonus_ref_name: 'va',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['botas', 'casco'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.MAX_HP,
      bonus_ref_name: 'hp',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 100, max: 2000 },
    valid: ['brazalete', 'collar', 'armadura', 'botas'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.VALOR_DE_ATAQUE,
      bonus_ref_name: 'ad',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 10, max: 30 },
    valid: ['armadura'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.OPCION_DE_ENVENENAMIENTO,
      bonus_ref_name: 'veneno',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 15 },
    valid: ['arma', 'casco'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.STR,
      bonus_ref_name: 'STR',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 2, max: 12 },
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.INT,
      bonus_ref_name: 'INT',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 2, max: 12 },
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEX,
      bonus_ref_name: 'DEX',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 2, max: 12 },
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.VIT,
      bonus_ref_name: 'VIT',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 2, max: 12 },
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_MONSTRUOS,
      bonus_ref_name: 'monstruos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 20 },
    valid: ['pendiente', 'collar', 'escudo'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_MEDIO_HUMANOS,
      bonus_ref_name: 'medio_humanos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 20 },
    valid: ['escudo', 'brazalete', 'pendiente'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DAÑO_CRITICO,
      bonus_ref_name: 'daño_critico',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 15 },
    valid: ['casco', 'armadura', 'collar'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.CORTA_CURACION,
      bonus_ref_name: 'corta_curacion',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 50 },
    valid: ['armadura', 'escudo'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.OPCION_DE_SANGRADO,
      bonus_ref_name: 'sangrado',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 15 },
    valid: ['botas', 'brazalete'],
  },
  {
    tier: 3,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.OPCION_DE_INCENDIO,
      bonus_ref_name: 'incendio',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 15 },
    valid: ['pendiente', 'collar'],
  },
];
