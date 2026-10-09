import { Injectable } from '@nestjs/common';
import { CharacterRace, Stats } from 'netim2-shared';
import { STATS_PROGRESS_BY_RACE } from '../../const/statsProgress/stats-progress-by-race.const';

@Injectable()
export class CharacterLevelScalingService {
    /** Suma base + per_lv * (level - 1); nivel 1 aporta solo la base de la raza. */
    applyLevelScaling(stats: Stats, race: CharacterRace, level: number): Stats {
        if (!Number.isInteger(level) || level < 1) {
            throw new Error('El nivel del personaje debe ser un entero mayor o igual a 1');
        }
        const progress = STATS_PROGRESS_BY_RACE[race];
        const result = structuredClone(stats);
        for (const key of Object.keys(progress.base) as (keyof typeof progress.base)[]) {
            const value = progress.base[key] + progress.per_lv[key] * (level - 1);
            if (key === 'ad' || key === 'ap') {
                result.general[key].min += value;
                result.general[key].max += value;
            } else if (key === 'hp' || key === 'mana') {
                result.general[key].max += value;
            } else {
                result.general[key] += value;
            }
        }
        return result;
    }
}
