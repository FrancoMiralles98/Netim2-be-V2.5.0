import { SkillsNamesType } from "src/modules/skill/types/const/skills-names.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const ESPEJO_SKILL_NAMES: SkillsNamesType = {
    [UNIQUE_ID_SKILLS.GOLPE_DE_DEDO]: {
        'N': 'Golpe de Dedo',
        'M': 'Golpe de Dedo Ardiente',
        'G': 'Explosión de Dedo',
        'P': 'Impacto de Pulsación',
    },
    [UNIQUE_ID_SKILLS.REMOLINO_DRAGON]: {
        'N': 'Remolino Dragón',
        'M': 'Remolino Tornado',
        'G': 'Ciclón',
        'P': 'Tempestad Dragón'
    },
    [UNIQUE_ID_SKILLS.ANULAR_MAGIA]: {
        'N': 'Anular Magia',
        'M': 'Anulación Potente de Magia',
        'G': 'Disruptor Mágico',
        'P': 'Extirpación de Magia',
    },
    [UNIQUE_ID_SKILLS.HOJA_ENCANTADA]: {
        'N': 'Hoja Encantada',
        'M': 'Espada Mística',
        'G': 'Lámina Arcana',
        'P': 'Filo del Crepúsculo',
    },
    [UNIQUE_ID_SKILLS.ARMADURA_ENCANTADA]: {
        'N': 'Armadura Encantada',
        'M': 'Placas Hechizadas',
        'G': 'Coraza Mística',
        'P': 'Armadura Espectral',
    },
    [UNIQUE_ID_SKILLS.MIEDO]: {
        'N': 'Miedo',
        'M': 'Eco del Pánico',
        'G': 'Sombras del Terror',
        'P': 'Velo del Horror'
    },
}