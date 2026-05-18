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

}