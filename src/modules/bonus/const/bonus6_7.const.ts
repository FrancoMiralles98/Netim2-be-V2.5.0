import { ValueBonusType } from "../types/bonus-in-item.type";
import { allFullNameBonusList } from "../types/bonusListHelper/bonus-list-full-name.enum";
import { BonusType } from "../types/bonusListHelper/bonus.type";

export const bonus6_7BonusList: BonusType[] = [
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.VALOR_DE_ATAQUE,
      bonus_ref_name: 'ad',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 10, max: 25 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.VALOR_DE_ATAQUE_MAGICO,
      bonus_ref_name: 'ap',
      type_value: ValueBonusType.FLAT,
    },
    values: { min: 10, max: 25 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_VENENO,
      bonus_ref_name: 'def_veneno',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_FUEGO,
      bonus_ref_name: 'def_incendio',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_SANGRADO,
      bonus_ref_name: 'def_sangrado',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_CHAMANES,
      bonus_ref_name: 'chaman',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_GUERREROS,
      bonus_ref_name: 'guerrero',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_SURAS,
      bonus_ref_name: 'sura',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_NINJAS,
      bonus_ref_name: 'ninja',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 10 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.DEFENSA_CHAMAN,
      bonus_ref_name: 'def_chaman',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 3, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.DEFENSA_GUERRERO,
      bonus_ref_name: 'def_guerrero',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 3, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.DEFENSA_NINJA,
      bonus_ref_name: 'def_ninja',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 3, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.DEFENSA_SURA,
      bonus_ref_name: 'def_sura',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 3, max: 5 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.MAX_HP,
      bonus_ref_name: 'hp',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 50, max: 800 },
    valid: [
      'armadura',
      'brazalete',
      'collar',
      'escudo',
      'pendiente',
      'arma',
      'botas',
      'casco',
    ],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.VELOCIDAD_DE_ATAQUE,
      bonus_ref_name: 'va',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['arma'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.FUERZA_CONTRA_MONSTRUOS,
      bonus_ref_name: 'monstruos',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 20 },
    valid: ['collar'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_DAÑO_DE_HABILIDAD,
      bonus_ref_name: 'def_hab',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: ['armadura'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_DAÑO_DE_MEDIA,
      bonus_ref_name: 'def_media',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: ['armadura'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.STR,
      bonus_ref_name: 'STR',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 1, max: 10 },
    valid: ['brazalete'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.INT,
      bonus_ref_name: 'INT',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 1, max: 10 },
    valid: ['brazalete'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.DEX,
      bonus_ref_name: 'DEX',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 1, max: 10 },
    valid: ['brazalete'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.VIT,
      bonus_ref_name: 'VIT',
      type_value: ValueBonusType.FLAT
    },
    values: { min: 1, max: 10 },
    valid: ['brazalete'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.ROBO_DE_VIDA,
      bonus_ref_name: 'robo_vida',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: ['botas'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.PROB_DE_BLOQUEAR_ATAQUES_BASICOS,
      bonus_ref_name: 'bloquear_ataques',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 10 },
    valid: ['escudo'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.VELOCIDAD_DE_MOVIMIENTO,
      bonus_ref_name: 'vm',
      type_value: ValueBonusType.FLAT,
    },
    values: { min: 1, max: 20 },
    valid: ['escudo'],
  },
  {
    category: 'bonus6_7',
    name: {
      full_name: allFullNameBonusList.REGENERACION_DE_HP,
      bonus_ref_name: 'regen_hp',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 35 },
    valid: ['pendiente'],
  },
];
