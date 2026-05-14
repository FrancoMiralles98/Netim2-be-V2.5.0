import { SkillsNamesType } from "src/modules/skill/types/const/skills-names.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const DRAGON_SKILLS_NAMES: SkillsNamesType = {
    [UNIQUE_ID_SKILLS.DISPARO_DEL_DRAGON]: {
        'N': 'Disparo del Dragón',
        'M': 'Ataque del Dragón',
        'G': 'Levantamiento del Dragón',
        'P': 'Furia Dragón',
    },
    [UNIQUE_ID_SKILLS.TALISMAN_VOLADOR]: {
        'N': 'Talismán Volador',
        'M': 'Talismán Reforzado',
        'G': 'Impacto Talismánico',
        'P': 'Explosión Talismánica',
    },
    [UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON]: {
        'N':'Rugido del Dragón',
        'M':'Grito del Dragón',
        'G':'Llanto del Dragón',
        'P':'Llamado del Dragón',
    },
    [UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON]: {
        'N':'Fuerza de Dragón',
        'M':'Poder del Dragón',
        'G':'Arte del Dragón',
        'P':'Maestría del Dragón',
    },
    [UNIQUE_ID_SKILLS.BENDICION]: {
        'N':'Bendición',
        'M':'Favor de los Cielos',
        'G':'Luz Bendita',
        'P':'Gracia Divina'
    },
    [UNIQUE_ID_SKILLS.REFLECTAR]: {
        'N':'Reflectar',
        'M':'Agua Reflectante',
        'G':'Espejo de Cristal',
        'P':'Proyección Reflectante',
    },
}