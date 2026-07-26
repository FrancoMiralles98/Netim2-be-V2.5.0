import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillsNames } from "src/modules/skill/types/skills-names.type";


export const CORPORAL_SKILLS_NAMES: SkillsNames = {
    [UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS]: {
        'N': 'Corte de Tres Maneras',
        'M': 'Tajo Triple',
        'G': 'Cuchillada Triple',
        'P': 'Trinidad Cortante',
    },
    [UNIQUE_ID_SKILLS.ROCIADA]: {
        'N': 'Rociada',
        'M': 'Rociada de balas',
        'G': 'Ataque Poderoso',
        'P': 'Carga Brutal'
    },
    [UNIQUE_ID_SKILLS.GIRO_DE_ESPADA]: {
        'N': 'Giro de Espada',
        'M': 'Danza de la Espada',
        'G': 'Remolino de Hoja',
        'P': 'Ciclón de Espada',
    },
    [UNIQUE_ID_SKILLS.BERSEK]: {
        'N': 'Bersek',
        'M': 'Furia',
        'G': 'Ira Primordial',
        'P': 'Frenesí'
    },
    [UNIQUE_ID_SKILLS.AURA_DE_ESPADA]: {
        'N': 'Aura de Espada',
        'M': 'Espada Espiritual',
        'G': 'Espada Fantasma',
        'P': 'Filo Etéreo',
    },
}