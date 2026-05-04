import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { BonusType } from "../../types/bonusListHelper/bonus-list.type";


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
    valid: ['escudo', 'collar'],
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
      full_name: allFullNameBonusList.DAÑO_ABSORBIDO_POR_HP,
      bonus_ref_name: 'daño_absorbido_hp',
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
      full_name: allFullNameBonusList.OPCION_DE_SANGRADO,
      bonus_ref_name: 'sangrado',
      type_value: ValueBonusType.PORCENTAGE,
    },
    values: { min: 1, max: 15 },
    valid: ['botas', 'brazalete'],
  },
  {
    tier: 4,
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
