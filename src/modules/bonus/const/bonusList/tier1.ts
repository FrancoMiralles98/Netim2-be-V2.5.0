import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { BonusType } from "../../types/bonusListHelper/bonus-list.type";

export const tier1BonusList: BonusType[] = [
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_ORCOS,
      bonus_ref_name: 'orcos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 10, max: 20 },
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_ANIMALES,
      bonus_ref_name: 'animales',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 10, max: 20 },
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_MISTICOS,
      bonus_ref_name: 'misticos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 10, max: 20 },
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_DEMONIOS,
      bonus_ref_name: 'demonios',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 10, max: 20 },
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_CONTRA_RETARDO,
      bonus_ref_name: 'def_retardo',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 50 },
    valid: ['escudo'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_ES_DE_REFLECTAR_GOLPES_CUERPO_A_CUERPO,
      bonus_ref_name: 'reflectar',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 25 },
    valid: ['armadura', 'escudo'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_BLOQUEAR_ATAQUES_CUERPO_A_CUERPO,
      bonus_ref_name: 'bloquear_ataques',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['escudo', 'botas'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_FUEGO,
      bonus_ref_name: 'def_incendio',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['casco', 'botas', 'armadura'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_VENENO,
      bonus_ref_name: 'def_veneno',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['casco', 'botas', 'armadura'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_SANGRADO,
      bonus_ref_name: 'def_sangrado',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['casco', 'botas', 'armadura'],
  },
  {
    tier: 1,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_EVITAR_FLECHAS,
      bonus_ref_name: 'esquivar_flecha',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 15 },
    valid: ['casco', 'botas'],
  },
];
