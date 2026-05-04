import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { BonusType } from "../../types/bonusListHelper/bonus-list.type";


export const tier2BonusList: BonusType[] = [
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_ESPADA,
      bonus_ref_name: 'espada',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_DOS_MANOS,
      bonus_ref_name: 'dos_manos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_DAGA,
      bonus_ref_name: 'daga',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_FAN,
      bonus_ref_name: 'fan',
      type_value: ValueBonusType.PORCENTAGE
    },
    values: { min: 5, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_CAMPANA,
      bonus_ref_name: 'campana',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_A_FLECHAS,
      bonus_ref_name: 'flecha',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_MAGIA,
      bonus_ref_name: 'magia',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_GOLPES_CRITICOS,
      bonus_ref_name: 'critico',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['arma', 'botas', 'collar'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_RETARDO,
      bonus_ref_name: 'retardo',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 15 },
    valid: ['arma', 'casco'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_GOLPES_DE_PENETRACION,
      bonus_ref_name: 'penetracion',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['arma', 'brazalete', 'collar'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_CAER_MAS_OBJETOS,
      bonus_ref_name: 'chances_objetos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 20 },
    valid: ['brazalete', 'pendiente', 'botas'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.AUMENTO_DE_OBJETOS_RAROS,
      bonus_ref_name: 'chances_raros',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 20 },
    valid: ['brazalete', 'pendiente', 'botas'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_CAER_EL_DOBLE_DE_YANG,
      bonus_ref_name: 'chances_yang',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 20 },
    valid: ['collar', 'escudo', 'botas'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PROB_DE_OBTENER_BONUS_DE_EXP,
      bonus_ref_name: 'chances_exp',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 20 },
    valid: ['collar', 'botas', 'escudo'],
  },
  {
    tier:2,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DEFENSA_CONTRA_DESMAYO,
      bonus_ref_name: 'def_desmayo',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 50 },
    valid: ['escudo'],
  },
];
