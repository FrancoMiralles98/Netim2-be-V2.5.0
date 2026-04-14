/**
 * Tipado de parametro que se usa para consumir una x cantidad de items del mismo tipo
 * - @property {cantidad} - es opcional ya que puede ser que se necesite consumir un item que no sea utilidad
 * - ya sea para mutar un arma. (en este caso pediria el arma tambien para consumir)
 * - @property {id} - es opcional, ya que si se necesitan solo consumir utilidad, este prioriza items de menor stack
 * a mayor stack, si es un item que NO es de utilidad, se tiene que pasar el id, ya que es un item espeficico
 * @note - si no se especifica la cantidad (aunque sea utility) se tomara que se tiene que remover todo el item
 */
export interface ItemsToConsumeType {
id?: string
idItem: number,
cantidad?: number
}