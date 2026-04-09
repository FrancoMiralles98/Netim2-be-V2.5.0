import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { TierBonusType } from "../../types/bonusListHelper/bonus-list.type";

export const tier1BonusList: TierBonusType[] = [
  {
    name: [
      allFullNameBonusList.FUERZA_CONTRA_ORCOS,
      'orcos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [10, 20],
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    name: [
      allFullNameBonusList.FUERZA_CONTRA_ANIMALES,
      'animales',
      ValueBonusType.PORCENTAGE,
    ],
    values: [10, 20],
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    name: [
      allFullNameBonusList.FUERZA_CONTRA_MISTICOS,
      'misticos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [10, 20],
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    name: [
      allFullNameBonusList.FUERZA_CONTRA_DEMONIOS,
      'demonios',
      ValueBonusType.PORCENTAGE,
    ],
    values: [10, 20],
    valid: ['arma', 'brazalete', 'collar', 'pendiente', 'casco'],
  },
  {
    name: [
      allFullNameBonusList.DEFENSA_CONTRA_RETARDO,
      'def_retardo',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 50],
    valid: ['escudo'],
  },
  {
    name: [
      allFullNameBonusList.PROB_ES_DE_REFLECTAR_GOLPES_CUERPO_A_CUERPO,
      'reflectar',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 25],
    valid: ['armadura', 'escudo'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_BLOQUEAR_ATAQUES_CUERPO_A_CUERPO,
      'bloquear_ataques',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['escudo', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_AL_FUEGO,
      'def_incendio',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['casco', 'botas', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_AL_VENENO,
      'def_veneno',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['casco', 'botas', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_AL_SANGRADO,
      'def_sangrado',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['casco', 'botas', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_EVITAR_FLECHAS,
      'esquivar_flecha',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 15],
    valid: ['casco', 'botas'],
  },
];
