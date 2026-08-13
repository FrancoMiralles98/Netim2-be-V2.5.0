import { allFullNameBonusList, BonusType, ValueBonusType } from "netim2-shared";

export const CORRUPT_IMPLICIT_BONUS: BonusType[] = [
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_VIT,
     bonus_ref_name: 'VIT',
     type_value: ValueBonusType.FLAT,
    },
    values: {min:1,max: 1},
    valid: ['escudo', 'arma'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_MISTICOS,
     bonus_ref_name: 'misticos',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 2},
    valid: ['escudo', 'arma'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_STR,
     bonus_ref_name: 'STR',
     type_value: ValueBonusType.FLAT,
    },
    values: {min:1,max: 1},
    valid: ['casco', 'botas'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_DEMONIOS,
     bonus_ref_name: 'demonios',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 2},
    valid: ['casco', 'botas'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_INT,
     bonus_ref_name: 'INT',
     type_value: ValueBonusType.FLAT,
    },
    values: {min:1,max: 1},
    valid: ['armadura', 'brazalete'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_ORCOS,
     bonus_ref_name: 'orcos',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 2},
    valid: ['armadura', 'brazalete'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_DEX,
     bonus_ref_name: 'DEX',
     type_value: ValueBonusType.FLAT,
    },
    values: {min:1,max: 1},
    valid: ['pendiente', 'collar'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_ANIMALES,
     bonus_ref_name: 'animales',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 2},
    valid: ['pendiente', 'collar'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_PENETRACION_HABILIDAD,
     bonus_ref_name: 'penetracion_habilidad',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 1},
    valid: ['arma'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_VA,
     bonus_ref_name: 'va',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 2},
    valid: ['arma'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_MEDIO_HUMANOS,
     bonus_ref_name: 'medio_humanos',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 5},
    valid: ['casco'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_MONSTRUOS,
     bonus_ref_name: 'monstruos',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 5},
    valid: ['casco'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_DAÑO_CRITICO,
     bonus_ref_name: 'daño_critico',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 5},
    valid: ['armadura'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_MAX_HP,
     bonus_ref_name: 'hp',
     type_value: ValueBonusType.FLAT,
    },
    values: {min:150,max: 700},
    valid: ['armadura'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_DURACION_ESTADO,
     bonus_ref_name: 'duracion_estado',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 4},
    valid: ['escudo'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_VM,
     bonus_ref_name: 'vm',
     type_value: ValueBonusType.FLAT
    },
    values: {min:1,max: 5},
    valid: ['escudo'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_ESTADO,
     bonus_ref_name: 'bonus_estado',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 2},
    valid: ['botas'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_REGEN_HP,
     bonus_ref_name: 'regen_hp',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:5,max: 10},
    valid: ['botas'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_VENENO,
     bonus_ref_name: 'bonus_veneno',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 4},
    valid: ['collar'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_VH,
     bonus_ref_name: 'vh',
     type_value: ValueBonusType.FLAT
    },
    values: {min:1,max: 1},
    valid: ['collar'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_SANGRAD,
     bonus_ref_name: 'bonus_sangrado',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 4},
    valid: ['brazalete'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_RESISTENCIA_AL_DAÑO_DE_HABILIDAD,
     bonus_ref_name: 'def_hab',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 1},
    valid: ['brazalete'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_BONUS_INCENDIO,
     bonus_ref_name: 'bonus_fuego',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 4},
    valid: ['pendiente'],
  },
  {
    category: 'corrupt',
    name: {
     full_name: allFullNameBonusList.CORRUPT_IMPLICIT_RESISTENCIA_AL_DAÑO_DE_MEDIA,
     bonus_ref_name: 'def_media',
     type_value: ValueBonusType.PORCENTAGE,
    },
    values: {min:1,max: 1},
    valid: ['pendiente'],
  },
];
