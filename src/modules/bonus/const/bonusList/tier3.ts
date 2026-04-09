import { ValueBonusType } from "../../types/bonus-in-item.type";
import { allFullNameBonusList } from "../../types/bonusListHelper/bonus-list-full-name.enum";
import { TierBonusType } from "../../types/bonusListHelper/bonus-list.type";


export const tier3BonusList: TierBonusType[] = [
  {
    name: [
      allFullNameBonusList.VELOCIDAD_DE_ATAQUE,
      'va',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['botas', 'casco'],
  },
  {
    name: [allFullNameBonusList.MAX_HP, 'hp', ValueBonusType.FLAT],
    values: [100, 2500],
    valid: ['brazalete', 'collar', 'armadura', 'botas'],
  },
  {
    name: [allFullNameBonusList.VALOR_DE_ATAQUE, 'ad', ValueBonusType.FLAT],
    values: [10, 30],
    valid: ['armadura'],
  },
  {
    name: [
      allFullNameBonusList.OPCION_DE_ENVENENAMIENTO,
      'veneno',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 15],
    valid: ['arma', 'casco'],
  },
  {
    name: [allFullNameBonusList.STR, 'STR', ValueBonusType.FLAT],
    values: [2, 12],
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    name: [allFullNameBonusList.INT, 'INT', ValueBonusType.FLAT],
    values: [2, 12],
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    name: [allFullNameBonusList.DEX, 'DEX', ValueBonusType.FLAT],
    values: [2, 12],
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    name: [allFullNameBonusList.VIT, 'VIT', ValueBonusType.FLAT],
    values: [2, 12],
    valid: ['arma', 'pendiente', 'escudo'],
  },
  {
    name: [
      allFullNameBonusList.OPCION_DE_DESMAYO,
      'desmayo',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 10],
    valid: ['arma', 'collar', 'botas'],
  },
  {
    name: [
      allFullNameBonusList.FUERZA_CONTRA_MONSTRUOS,
      'monstruos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 20],
    valid: ['pendiente', 'collar', 'escudo'],
  },
  {
    name: [
      allFullNameBonusList.FUERZA_CONTRA_MEDIO_HUMANOS,
      'medio_humanos',
      ValueBonusType.PORCENTAGE,
    ],
    values: [5, 20],
    valid: ['escudo', 'brazalete', 'pendiente'],
  },
  {
    name: [
      allFullNameBonusList.DAÑO_CRITICO,
      'daño_critico',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 15],
    valid: ['casco', 'armadura', 'collar'],
  },
  {
    name: [
      allFullNameBonusList.CORTA_CURACION,
      'corta_curacion',
      ValueBonusType.PORCENTAGE,
    ],
    values: [1, 50],
    valid: ['armadura', 'escudo'],
  },
];
