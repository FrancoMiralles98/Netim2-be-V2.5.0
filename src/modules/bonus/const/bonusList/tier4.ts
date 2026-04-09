import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { TierBonusType } from "../../types/bonusListHelper/bonus-list.type";


export const tier4BonusList: TierBonusType[] = [
  {
    name: [
      allFullNameBonusList.DAÑO_DE_MEDIA,
      'media',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 60],
    valid: ['arma'],
  },
  {
    name: [
      allFullNameBonusList.REGENERACION_DE_HP,
      'regen_hp',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 50],
    valid: ['escudo', 'collar'],
  },
  {
    name: [
      allFullNameBonusList.DAÑO_DE_HABILIDAD,
      'habilidad',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 30],
    valid: ['arma'],
  },
  {
    name: [
      allFullNameBonusList.DAÑO_ABSORBIDO_POR_HP,
      'daño_absorbido_hp',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 3],
    valid: ['armadura'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_AL_DAÑO_DE_HABILIDAD,
      'def_hab',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 7],
    valid: ['escudo', 'casco'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_AL_DAÑO_DE_MEDIA,
      'def_media',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 7],
    valid: ['collar', 'pendiente'],
  },
  {
    name: [
      allFullNameBonusList.OPCION_DE_SANGRADO,
      'sangrado',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 15],
    valid: ['botas', 'brazalete'],
  },
  {
    name: [
      allFullNameBonusList.OPCION_DE_INCENDIO,
      'incendio',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 15],
    valid: ['pendiente', 'collar'],
  },
];
