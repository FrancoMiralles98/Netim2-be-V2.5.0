import { Injectable } from '@nestjs/common';
import { MobModel } from '../mob/schema/mob.schema';
import { RngService } from '../shared/services/rng.service';
import { DROP_CONFIG_BY_ENEMY_TYPE } from './config/drop/drop-difficulty.config';
import { CharacterStats } from '../character/types/baseCharacterProps/character-stats.type';
import { MicsBonusService } from './service/miscs-bonus.service';
import { DropResult } from './types/drop-result.type';
import { ItemDropService } from './service/item-drop.service';

@Injectable()
export class DropService {
    constructor(
        private rngService: RngService,
        private miscsBonusService: MicsBonusService,
        private itemDropService: ItemDropService
    ) { }


    generateMobDrop(
        mob: MobModel,
        bonus: CharacterStats['bonus']['miscs']
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

        return dropResult
    }
}
