import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillsNames } from "src/modules/skill/types/skills-names.type";

export const MENTAL_SKILLS_NAMES: SkillsNames = {
    [UNIQUE_ID_SKILLS.PULSO_ESPIRITUAL]: {
        'N': 'Pulso Espiritual',
        'M': 'Onda de Choque',
        'G': 'Ataque Tsunami',
        'P': 'Impacto Colosal',
    },
    [UNIQUE_ID_SKILLS.GOLPE]: {
        'N': 'Golpe',
        'M': 'Golpe de Tigre',
        'G': 'Golpe de Dragón',
        'P': 'Golpe Divino'
    },
    [UNIQUE_ID_SKILLS.TOCON]: {
        'N': 'Tocón',
        'M': 'Tocón Destructor',
        'G': 'Tocon de León',
        'P': 'Tocón de Rinoceronte',
    },
    [UNIQUE_ID_SKILLS.GOLPE_DE_ESPADA]: {
        'N': 'Golpe de Espada',
        'M': 'Rayo de Espada',
        'G': 'Golpe de Tormenta',
        'P': 'Espada Relámpago',
    },
    [UNIQUE_ID_SKILLS.CUERPO_FUERTE]: {
        'N': 'Cuerpo Fuerte',
        'M': 'Cuerpo de Hierro',
        'G': 'Cuerpo de Acero',
        'P': 'Cuerpo Inquebrantable',
    },
}