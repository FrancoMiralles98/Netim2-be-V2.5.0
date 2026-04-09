import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { TierBonusType } from "../../types/bonusListHelper/bonus-list.type";

export const CORRUPT_IMPLICIT_BONUS: TierBonusType[] = [
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_VIT,
      'VIT',
      ValueBonusType.FLAT,
    ],
    values: [1, 1],
    valid: ['escudo', 'arma'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_MISTICOS,
      'misticos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 2],
    valid: ['escudo', 'arma'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_STR,
      'STR',
      ValueBonusType.FLAT,
    ],
    values: [1, 1],
    valid: ['casco', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_DEMONIOS,
      'demonios',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 2],
    valid: ['casco', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_INT,
      'INT',
      ValueBonusType.FLAT,
    ],
    values: [1, 1],
    valid: ['armadura', 'brazalete'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_ORCOS,
      'orcos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 2],
    valid: ['armadura', 'brazalete'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_DEX,
      'DEX',
      ValueBonusType.FLAT,
    ],
    values: [1, 1],
    valid: ['pendiente', 'collar'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_ANIMALES,
      'animales',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 2],
    valid: ['pendiente', 'collar'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_PENETRACION_HABILIDAD,
      'penetracion_habilidad',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 1],
    valid: ['arma'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_VA,
      'va',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 2],
    valid: ['arma'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_MEDIO_HUMANOS,
      'medio_humanos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 5],
    valid: ['casco'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_MONSTRUOS,
      'monstruos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 5],
    valid: ['casco'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_DAÑO_CRITICO,
      'daño_critico',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 5],
    valid: ['armadura'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_MAX_HP,
      'hp',
      ValueBonusType.FLAT,
    ],
    values: [150, 700],
    valid: ['armadura'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_DURACION_ESTADO,
      'duracion_estado',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 4],
    valid: ['escudo'],
  },
  {
    name: [allFullNameBonusList.CORRUPT_IMPLICIT_VM, 'vm', ValueBonusType.FLAT],
    values: [1, 5],
    valid: ['escudo'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_ESTADO,
      'bonus_estado',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 2],
    valid: ['botas'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_REGEN_HP,
      'regen_hp',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 10],
    valid: ['botas'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_VENENO,
      'bonus_veneno',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 4],
    valid: ['collar'],
  },
  {
    name: [allFullNameBonusList.CORRUPT_IMPLICIT_VH, 'vh', ValueBonusType.FLAT],
    values: [1, 3],
    valid: ['collar'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_SANGRAD,
      'bonus_sangrado',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 4],
    valid: ['brazalete'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_RESISTENCIA_AL_DAÑO_DE_HABILIDAD,
      'def_hab',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 1],
    valid: ['brazalete'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_INCENDIO,
      'bonus_fuego',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 4],
    valid: ['pendiente'],
  },
  {
    name: [
      allFullNameBonusList.CORRUPT_IMPLICIT_RESISTENCIA_AL_DAÑO_DE_MEDIA,
      'def_media',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 1],
    valid: ['pendiente'],
  },
];
