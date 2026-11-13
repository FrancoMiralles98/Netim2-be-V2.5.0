import type { SkillProgressionLimits } from 'netim2-shared';

/** Máximos para validar niveles y acumular rangos anteriores; P es un hito sin subniveles. */
export const SKILL_PROGRESSION_LIMITS: SkillProgressionLimits = {
    maxLevelByRank: { N: 16, M: 10, G: 10 },
};
