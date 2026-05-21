export type BonusStatsGeneralRefKeys =
  | 'VIT'
  | 'INT'
  | 'STR'
  | 'DEX'
  | 'hp'
  | 'regen_hp'
  | 'def'
  | 'vh'
  | 'va'
  | 'vm'
  | 'ad'
  | 'ap'


export type BonusDañoRefKeys =
  | 'veneno'
  | 'animales'
  | 'incendio'
  | 'sangrado'
  | 'bonus_veneno'
  | 'bonus_fuego'
  | 'bonus_estado'
  | 'bonus_sangrado'
  | 'duracion_estado'
  | 'media'
  | 'habilidad'
  | 'critico'
  | 'daño_critico'
  | 'penetracion'
  | 'penetracion_habilidad'
  | 'orcos'
  | 'doble_golpe'
  | 'misticos'
  | 'demonios'
  | 'medio_humanos'
  | 'monstruos'
  | 'guerrero'
  | 'sura'
  | 'ninja'
  | 'chaman';

export type BonusDefensaRefKeys =
  | 'robo_vida'
  | 'vampirismo_hechizo'
  | 'bloquear_ataques'
  | 'esquivar_ataques'
  | 'reflectar'
  | 'corta_curacion'
  | 'def_espada'
  | 'def_desmayo'
  | 'def_retardo'
  | 'def_dos_manos'
  | 'def_daga'
  | 'def_flecha'
  | 'def_fan'
  | 'def_campana'
  | 'def_magia'
  | 'def_veneno'
  | 'def_sangrado'
  | 'def_media'
  | 'def_hab'
  | 'def_guerrero'
  | 'def_ninja'
  | 'def_sura'
  | 'def_chaman'
  | 'def_incendio'
  | 'damage_taken';

export type BonusCCRefKeys = 'retardo' | 'desmayo';

export type BonusMiscsRefKeys =
  | 'chances_yang'
  | 'chances_objetos'
  | 'chances_raros'
  | 'chances_exp'
  | 'bonus_yang'
  | 'bonus_exp'
  | 'time_reduction';

export type BonusRefKeys =
  | BonusStatsGeneralRefKeys
  | BonusDañoRefKeys
  | BonusDefensaRefKeys
  | BonusCCRefKeys
  | BonusMiscsRefKeys;

export type Tier1RefBonusName = Extract<BonusRefKeys,
  | 'orcos'
  | 'animales'
  | 'misticos'
  | 'demonios'
  | 'def_retardo'
  | 'reflectar'
  | 'bloquear_ataques'
  | 'def_incendio'
  | 'def_veneno'>

export type Tier2RefBonusName = Extract<BonusRefKeys,
  | 'def_espada'
  | 'def_dos_manos'
  | 'def_daga'
  | 'def_fan'
  | 'def_campana'
  | 'def_flecha'
  | 'def_magia'
  | 'critico'
  | 'retardo'
  | 'desmayo'
  | 'penetracion'
  | 'chances_objetos'
  | 'chances_raros'
  | 'chances_yang'
  | 'chances_exp'
  | 'def_desmayo'>

export type Tier3RefBonusName = Extract<BonusRefKeys,
  | 'va'
  | 'hp'
  | 'ad'
  | 'veneno'
  | 'STR'
  | 'INT'
  | 'DEX'
  | 'VIT'
  | 'incendio'
  | 'sangrado'
  | 'monstruos'
  | 'medio_humanos'>

export type Tier4RefBonusName = Extract<BonusRefKeys,
  | 'media'
  | 'regen_hp'
  | 'habilidad'
  | 'robo_vida'
  | 'vampirismo_hechizo'
  | 'def_hab'
  | 'def_media'>

export type Bonus6_7RefBonusName = Extract<BonusRefKeys,
  | 'ad'
  | 'ap'
  | 'def_veneno'
  | 'def_incendio'
  | 'hp'
  | 'va'
  | 'monstruos'
  | 'def_hab'
  | 'def_media'
  | 'hab'
  | 'media'
  | 'STR'
  | 'INT'
  | 'DEX'
  | 'VIT'
  | 'robo_vida'
  | 'bloquear_ataques'
  | 'vm'
  | 'regen_hp'>