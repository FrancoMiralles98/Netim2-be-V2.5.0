/**
 * @description - se generaron tipados para los nombres de cada tier de bonus para tener 
 * una mejor validacion a la hora de crear estas listas de bonus, evitar errores gramaticos
 * y tener otro nivel de proteccion a la hora de agregar un bonus a una lista equivocada
 */

export type Tier1MainBonusName =
  | 'Fuerza contra Orcos'
  | 'Fuerza contra Animales'
  | 'Fuerza contra Misticos'
  | 'Fuerza contra Demonios'
  | 'Defensa contra Retardo'
  | 'Prob.es de Reflectar golpes cuerpo a cuerpo'
  | 'Prob. de bloquear ataques cuerpo a cuerpo'
  | 'Resistencia al Fuego'
  | 'Resistencia al Veneno'
  | 'Prob. de Evitar Flechas';

export type Tier2MainBonusName =
  | 'Defensa Espada'
  | 'Defensa Dos Manos'
  | 'Defensa Daga'
  | 'Defensa Fan'
  | 'Defensa Campana'
  | 'Resistencia a Flechas'
  | 'Resistencia Magia'
  | 'Prob. de Golpes Críticos'
  | 'Prob. de Retardo'
  | 'Prob. de Golpes de Penetracion'
  | 'Prob. de Caer mas Objetos'
  | 'Aumento de Objetos Raros'
  | 'Prob. de Caer el Doble de Yang'
  | 'Prob. de obtener bonus de EXP'
  | 'Defensa contra Desmayo';

export type Tier3MainBonusName =
  | 'Velocidad de ataque'
  | 'Max HP'
  | 'Valor de ataque'
  | 'Opcion de Envenenamiento'
  | 'STR'
  | 'INT'
  | 'DEX'
  | 'VIT'
  | 'Opcion de Desmayo'
  | 'Fuerza contra Monstruos'
  | 'Fuerza contra Medio Humanos';

export type Tier4MainBonusName =
  | 'Daño de Media'
  | 'Regeneración de HP'
  | 'Daño de Habilidad'
  | 'Daño Absorbido por HP'
  | 'Resistencia al daño de habilidad'
  | 'Resistencia al daño de media';

export type bonus6_7MainBonusName =
  | 'Valor de ataque'
  | 'Valor de ataque mágico'
  | 'Resistencia al Veneno'
  | 'Resistencia al Fuego'
  | 'Max HP'
  | 'Velocidad de ataque'
  | 'Fuerza contra Monstruos'
  | 'Resistencia al daño de habilidad'
  | 'Resistencia al daño de media'
  | 'Daño de Habilidad'
  | 'Daño de Media'
  | 'STR'
  | 'INT'
  | 'DEX'
  | 'VIT'
  | 'Daño Absorbido por HP'
  | 'Prob. de bloquear ataques cuerpo a cuerpo'
  | 'Velocidad de Movimiento'
  | 'Regeneración de HP';
