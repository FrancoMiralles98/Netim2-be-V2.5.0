import { Injectable } from '@nestjs/common';
import { MobModel } from '../mob/schema/mob.schema';
import { RngService } from '../shared/services/rng.service';
import { DROP_DIFFICULTY_CONFIG } from './config/drop-difficulty.config';
import { CharacterStats } from '../character/types/baseCharacterProps/character-stats.type';
import { MicsBonusService } from './service/miscs-bonus.service';
import { DropResult } from './types/drop-result.type';

@Injectable()
export class DropService {
    constructor(
        private rngService: RngService,
        private miscsBonusService: MicsBonusService
    ) { }


    generateMobDrop(
        mob: MobModel,
        bonus: CharacterStats['bonus']['miscs']
    ): DropResult {
        const dropConfig = structuredClone(DROP_DIFFICULTY_CONFIG[mob.dificultad])

        const dropResult:DropResult = {
            drop: [],
            exp: 0,
            yang: 0
        }

        let totalAttempts = this.rngService.randomNumberInRange(dropConfig.attempts.min, dropConfig.attempts.max)

        if (this.rngService.rollChance(bonus.chances_objetos)) {
            dropConfig.resultChances = this.miscsBonusService.applyItemDropChanceBonus(dropConfig.resultChances)
        }

        for (let index = 0; index < totalAttempts; index++) {
            const result = this.rngService.pickWeightedResult(dropConfig.resultChances)
            
            if (result === 'nothing') {
                continue;
            }

            if (result === 'yang') {
                dropResult.yang += this.miscsBonusService.calculateYang(bonus,mob.yang)
            }

            if (result === 'item') {

            }
            
        }

        return dropResult
    }
}
