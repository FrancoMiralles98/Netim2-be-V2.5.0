import { Injectable } from "@nestjs/common";

@Injectable()
export class RngService {
    randomNumberInRange(min: number = 1, max: number = 100, decimal?: boolean): number {
        if (min > max) {
            throw new Error('El mínimo no puede ser mayor al máximo')
        }

        if (decimal) {
            return Math.random() * (max - min) + min
        }

        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    rollChance(chance: number): boolean {
        const roll = Math.floor(Math.random() * 100) + 1

        return roll <= chance
    }

    /**
    * Selecciona un resultado aleatorio a partir de una tabla de probabilidades.
    *
    * Cada propiedad del objeto representa un resultado posible y su valor
    * representa el porcentaje de probabilidad asociado.
    *
    * Ejemplo:
    * pickWeightedValue({
    *   equipment: 35,
    *   generic_utility: 20,
    *   mob_specific: 15,
    *   chest: 15,
    *   special: 15,
    * })
    *
    * Resultado posible => equipment
    *
    * @template T Tipo de las claves posibles del resultado.
    * @param chances Tabla de probabilidades donde la clave es el resultado
    * y el valor es su porcentaje de aparición.
    *
    * @returns La clave seleccionada según las probabilidades configuradas.
    *
    */
    pickWeightedResult<T extends string>(
        weights: Partial<Record<T, number>>,
    ): T {

        const total = (Object.values(weights) as Array<number | undefined>)
            .reduce<number>((acc, value) => acc + (value ?? 0), 0)

        if (total <= 0) {
            throw new Error('La suma de los pesos debe ser mayor a 0')
        }

        const roll = this.randomNumberInRange(1, total)

        let accumulated = 0

        for (const [key, weight] of Object.entries(weights) as Array<[T, number | undefined]>) {
            if (weight === undefined || weight <= 0) {
                continue
            }

            accumulated += weight

            if (roll <= accumulated) {
                return key
            }
        }

        throw new Error('No se pudo determinar el resultado del roll')
    }

}