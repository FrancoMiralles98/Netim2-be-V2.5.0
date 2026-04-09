import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { TierBonusType } from "../../types/bonusListHelper/bonus-list.type";


export const tier2BonusList: TierBonusType[] = [
  {
    name: [
      allFullNameBonusList.DEFENSA_ESPADA,
      'espada',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.DEFENSA_DOS_MANOS,
      'dos_manos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.DEFENSA_DAGA,
      'daga',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [allFullNameBonusList.DEFENSA_FAN, 'fan', ValueBonusType.PORCENTAGE],
    values: [5, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.DEFENSA_CAMPANA,
      'campana',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_A_FLECHAS,
      'flecha',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.RESISTENCIA_MAGIA,
      'magia',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['brazalete', 'pendiente', 'casco', 'armadura'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_GOLPES_CRITICOS,
      'critico',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['arma', 'botas', 'collar'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_RETARDO,
      'retardo',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 15],
    valid: ['arma', 'casco'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_GOLPES_DE_PENETRACION,
      'penetracion',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['arma', 'brazalete', 'collar'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_CAER_MAS_OBJETOS,
      'chances_objetos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 20],
    valid: ['brazalete', 'pendiente', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.AUMENTO_DE_OBJETOS_RAROS,
      'chances_raros',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 20],
    valid: ['brazalete', 'pendiente', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_CAER_EL_DOBLE_DE_YANG,
      'chances_yang',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 20],
    valid: ['collar', 'escudo', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.PROB_DE_OBTENER_BONUS_DE_EXP,
      'chances_exp',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 20],
    valid: ['collar', 'botas', 'escudo'],
  },
  {
    name: [
      allFullNameBonusList.DEFENSA_CONTRA_DESMAYO,
      'def_desmayo',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 50],
    valid: ['escudo'],
  },
];
