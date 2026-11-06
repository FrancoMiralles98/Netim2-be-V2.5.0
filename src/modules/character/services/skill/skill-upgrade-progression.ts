import { BadRequestException } from '@nestjs/common';
import type { SkillType } from 'netim2-shared';
import { SKILL_PROGRESSION_LIMITS } from '../../../skill/config/skill-progression-limits.config';

type SkillLevel = Pick<SkillType, 'mastery' | 'lv'>;

/** N0 is the existing unlearned state. Calculators only accept learned skills. */
export function getNextSkillLevel({ mastery, lv }: SkillLevel): SkillLevel | null {
    if (!Number.isSafeInteger(lv) || lv < 0) throw new BadRequestException('Nivel de habilidad inválido');
    if (mastery === 'P') return null;
    if (mastery !== 'N' && mastery !== 'M' && mastery !== 'G') {
        throw new BadRequestException('Maestría de habilidad inválida');
    }
    const limit = SKILL_PROGRESSION_LIMITS.maxLevelByRank[mastery];
    if (lv > limit || (mastery !== 'N' && lv === 0)) throw new BadRequestException('Nivel de habilidad inválido');
    if (lv < limit) return { mastery, lv: lv + 1 };
    const nextRank = { N: 'M', M: 'G', G: 'P' } as const;
    return { mastery: nextRank[mastery], lv: 1 };
}
