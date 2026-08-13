import { allFullNameBonusList, BonusType, ValueBonusType } from "netim2-shared";

export const tier4BonusList: BonusType[] = [
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DAÑO_DE_MEDIA,
      bonus_ref_name: 'media',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 60 },
    valid: ['arma'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.REGENERACION_DE_HP,
      bonus_ref_name: 'regen_hp',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 5, max: 50 },
    valid: ['escudo'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.PENETRACION_HABILIDAD,
      bonus_ref_name: 'penetracion_habilidad',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 7 },
    valid: ['brazalete'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.DAÑO_DE_HABILIDAD,
      bonus_ref_name: 'habilidad',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 30 },
    valid: ['arma'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.ROBO_DE_VIDA,
      bonus_ref_name: 'robo_vida',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 3 },
    valid: ['armadura'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_DAÑO_DE_HABILIDAD,
      bonus_ref_name: 'def_hab',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 7 },
    valid: ['escudo', 'casco'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.RESISTENCIA_AL_DAÑO_DE_MEDIA,
      bonus_ref_name: 'def_media',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 7 },
    valid: ['collar', 'pendiente'],
  },
  {
    tier: 4,
    category: "generic",
    name: {
      full_name: allFullNameBonusList.VAMPIRISMO_DE_HECHIZO,
      bonus_ref_name: 'vampirismo_hechizo',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 5 },
    valid: ['botas'],
  },
];
