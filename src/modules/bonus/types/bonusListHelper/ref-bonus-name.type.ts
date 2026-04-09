/**
 * @description
 * Nombre de referencia que tiene cada tier de bonus
 * Se utiliza mas para tener una validacion de que esta bien escrito en cada lista
 * y ademas para evitar que lista de bonus tengas referencias a bonus de 
 * diferente tier
 * 
 */

export type Tier1RefBonusName =
  | 'orcos'
  | 'animales'
  | 'misticos'
  | 'demonios'
  | 'def_retardo'
  | 'reflectar'
  | 'bloquear_ataques'
  | 'def_incendio'
  | 'def_veneno'
  | 'esquivar_flecha';

export type Tier2RefBonusName =
  | 'espada'
  | 'dos_manos'
  | 'daga'
  | 'fan'
  | 'campana'
  | 'flecha'
  | 'magia'
  | 'critico'
  | 'retardo'
  | 'penetracion'
  | 'chances_objetos'
  | 'chances_raros'
  | 'chances_yang'
  | 'chances_exp'
  | 'def_desmayo';

export type Tier3RefBonusName =
  | 'va'
  | 'hp'
  | 'ad'
  | 'veneno'
  | 'STR'
  | 'INT'
  | 'DEX'
  | 'VIT'
  | 'desmayo'
  | 'monstruos'
  | 'medio_humanos';

export type Tier4RefBonusName =
  | 'media'
  | 'regen_hp'
  | 'habilidad'
  | 'daño_absorbido_hp'
  | 'def_hab'
  | 'def_media';

export type Bonus6_7RefBonusName =
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
  | 'daño_absorbido_hp'
  | 'bloquear_ataques'
  | 'vm'
  | 'regen_hp';

  /**
   * 
   * @description
   * Se hace un tipado de todos los ref bonus que existen en el juego para luego
   * unificarlo y tener todas las referencias en en un solo tipo, 
   */

  type BonusStatsGeneralRefKeys =
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
  | 'ap';

type BonusDañoRefKeys =
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

type BonusDefensaRefKeys =
  | 'daño_absorbido_hp'
  | 'bloquear_ataques'
  | 'esquivar_ataques'
  | 'reflectar'
  | 'esquivar_flecha'
  | 'corta_curacion'
  | 'espada'
  | 'def_desmayo'
  | 'def_retardo'
  | 'dos_manos'
  | 'daga'
  | 'flecha'
  | 'fan'
  | 'campana'
  | 'magia'
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

type BonusCCRefKeys = 'retardo' | 'desmayo';

type BonusMiscsRefKeys =
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
