import type { Atributos, SkillProgressionLimits, SkillProgressionPoint, Stats } from 'netim2-shared';

/** Contexto de lectura: el consumidor prepara las stats y los atributos usados como fuentes. */
export interface SkillScalingContext {
    /** Rango y nivel de la habilidad; no es el nivel del personaje. */
    progression: SkillProgressionPoint;
    /** Necesarias solo si el escalado contiene contribuciones por stats. */
    stats?: Stats;
    /** Necesarios solo si hay contribuciones por atributos; se usa lvPoints + bonusPoints. */
    attributes?: Atributos;
    /** Si se omiten, usa SKILL_PROGRESSION_LIMITS para acumular los rangos completados. */
    limits?: SkillProgressionLimits;
}
