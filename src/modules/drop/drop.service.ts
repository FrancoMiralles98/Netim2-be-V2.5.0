import { Injectable } from '@nestjs/common';
import { MobModel } from '../mob/schema/mob.schema';
import { RngService } from '../shared/services/rng.service';
import { DROP_CONFIG_BY_ENEMY_TYPE } from './config/drop/drop-difficulty.config';
import { MicsBonusService } from './service/miscs-bonus.service';
import { DropResult } from './types/drop-result.type';
import { ItemDropService } from './service/item-drop.service';
import { Stats } from 'netim2-shared';

@Injectable()
export class DropService {
    constructor(
        private rngService: RngService,
        private miscsBonusService: MicsBonusService,
        private itemDropService: ItemDropService
    ) { }


    /**
    * Genera las recompensas obtenidas al derrotar un enemigo.
    *
    * El proceso de generación de drops utiliza la configuración asociada
    * al tipo y dificultad del enemigo para determinar la cantidad de intentos
    * de drop y el resultado de cada uno.
    *
    * Cada intento puede producir:
    * - Nada.
    * - Yang.
    * - Un ítem.
    *
    * Además, las probabilidades de drop y la cantidad de yang obtenida pueden
    * verse modificadas por los bonus misceláneos del personaje.
    *
    * Finalmente, se calcula la experiencia otorgada aplicando los modificadores
    * correspondientes.
    *
    * @param mob Enemigo derrotado del cual se generarán las recompensas.
    * @param bonus Bonus misceláneos del personaje que afectan experiencia,
    * drops y cantidad de yang obtenida.
    *
    * @returns Resultado final del drop, incluyendo:
    * - Lista de ítems obtenidos.
    * - Cantidad total de yang.
    * - Experiencia ganada.
    *
    */
    generateMobDrop(
        mob: MobModel,
        bonus: Stats['bonus']['miscs']
    ): DropResult {
        const dropConfig = structuredClone(DROP_CONFIG_BY_ENEMY_TYPE[mob.enemie_type][mob.dificultad])

        const dropResult: DropResult = {
            items: [],
            exp: 0,
            yang: 0
        }

        let totalAttempts = this.rngService.randomNumberInRange(dropConfig.attempts.min, dropConfig.attempts.max)

        dropConfig.resultChances = this.miscsBonusService.applyItemDropAndYangChanceBonus(dropConfig.resultChances,bonus)

        for (let index = 0; index < totalAttempts; index++) {
            const result = this.rngService.pickWeightedResult(dropConfig.resultChances)

            if (result === 'nothing') {
                continue;
            }

            if (result === 'yang') {
                dropResult.yang += this.miscsBonusService.calculateYang(bonus, mob.yang)
            }

            if (result === 'item') {
                dropResult.items.push(this.itemDropService.dropItem(mob, bonus))
            }
        }

        dropResult.exp = this.miscsBonusService.calculateExp(bonus,mob.exp)

        return dropResult
    }
}
