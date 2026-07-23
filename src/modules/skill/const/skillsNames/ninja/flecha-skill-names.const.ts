import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillsNames } from "src/modules/skill/types/skills-names.type";


export const FLECHA_SKILLS_NAMES: SkillsNames = {
    [UNIQUE_ID_SKILLS.DISPARO_REPETIDO]: {
        'N': 'Disparo Repetido',
        'M': 'Multi-golpe',
        'G': 'Disparo Acelerado',
        'P': 'Cadencia Letal',
    },
    [UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO]: {
        'N': 'Flecha de Fuego',
        'M': 'Flecha de Llama',
        'G': 'Flecha Incendiaria',
        'P': 'Flecha Infernal',
    },
    [UNIQUE_ID_SKILLS.FLECHA_VENENOSA]: {
        'N': 'Flecha Venenosa',
        'M': 'Flecha Tóxica',
        'G': 'Flecha Putrefacta',
        'P': 'Flecha Mortal',
    },
    [UNIQUE_ID_SKILLS.LLUVIA_DE_FLECHAS]: {
        'N': 'Lluvia de Flechas',
        'M': 'Lluvia Dinámica',
        'G': 'Torrente de Flechas',
        'P': 'Flechas Ciclónicas',
    },
    [UNIQUE_ID_SKILLS.CAMINO_PLUMA]: {
        'N': 'Camino Pluma',
        'M': 'Sendero Ligero',
        'G': 'Andar del Viento',
        'P': 'Velocidad de Dios',
    },
}