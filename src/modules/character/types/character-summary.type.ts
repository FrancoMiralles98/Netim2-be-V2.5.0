import { BaseCharacterProps } from "./baseCharacterProps/base-character-props.type";

/**
 * Define la base de datos que se utiliza para construir el resumen de un personaje.
 *
 * Este tipo toma únicamente las propiedades necesarias de `BaseCharacterProps`
 * para mostrar un personaje en la pantalla de selección.
 *
 * @see BaseCharacterProps
 */
type CharacterSummaryBase = Pick<
  BaseCharacterProps,
  | 'lv'
  | 'nombre'
  | 'time_played'
  | 'gremio_options'
  | 'genero'
  | 'reino'
  | 'raza'
  | 'stats'
  | 'especialidad'
>;


/**
 * Representa una versión resumida de un personaje para enviar al cliente.
 *
 * Se usa principalmente en la selección de personajes, donde no es necesario
 * exponer toda la información persistida del personaje.
 *
 * A diferencia del modelo completo, expone el identificador como `id` en formato
 * `string` y limita `stats` únicamente a los atributos principales del personaje.
 *
 * @see CharacterSummaryBase
 * @see BaseCharacterProps
 */
export type CharacterSummary = Omit<CharacterSummaryBase, 'stats'> & {
  id: string;
  stats: Pick<BaseCharacterProps['stats'], 'atributos'>;
};