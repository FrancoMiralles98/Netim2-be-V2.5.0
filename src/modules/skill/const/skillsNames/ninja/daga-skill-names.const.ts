import { SkillsNamesType } from "src/modules/skill/types/const/skills-names.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const DAGA_SKILLS_NAMES: SkillsNamesType = {
    [UNIQUE_ID_SKILLS.EMBOSCADA]: {
        'N': 'Emboscada',
        'M': 'Ataque Camuflado',
        'G': 'Emboscada Camuflada',
        'P': 'Emboscada Mortal',
    },
    [UNIQUE_ID_SKILLS.DAGA_RODANTE]: {
        'N': 'Daga Rodante',
        'M': 'Daga Espiral',
        'G': 'Desenlace Rodante',
        'P': 'Danza de la Daga',
    },
    [UNIQUE_ID_SKILLS.NUBE_TOXICA]: {
        'N': 'Nube Tóxica',
        'M': 'Nube Mortal',
        'G': 'Nebulosa Letal',
        'P': 'Nube Asesina'
    },
    [UNIQUE_ID_SKILLS.ATAQUE_RAPIDO]: {
        'N': 'Ataque Rápido',
        'M': 'Relocalización del Cuerpo',
        'G': 'Tajo Instantáneo',
        'P': 'Asalto Relámpago',
    },
    [UNIQUE_ID_SKILLS.CAMUFLAJE]: {
        'N': 'Camuflaje',
        'M': 'Caminar silencioso',
        'G': 'Disimulo',
        'P': 'Invisibilidad Temporal',
    },
}