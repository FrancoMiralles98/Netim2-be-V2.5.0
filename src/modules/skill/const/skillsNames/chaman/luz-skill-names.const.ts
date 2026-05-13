import { SkillsNamesType } from "src/modules/skill/types/const/skills-names.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const LUZ_SKILLS_NAMES: SkillsNamesType = {
    [UNIQUE_ID_SKILLS.LLAMADA_RELAMPAGO]: {
        'N':'Llamada Relámpago',
        'M':'Rayo de Invocación',
        'G':'Explosión Relámpago',
        'P':'Descarga Celestial',
    },
    [UNIQUE_ID_SKILLS.TIRO_RELAMPAGO]: {
        'N':'Tiro Relámpago',
        'M':'Sacudida de Relámpago',
        'G':'Golpe Trueno',
        'P':'Rayo Destructor',
    },
    [UNIQUE_ID_SKILLS.GARRA_RELAMPAGO]: {
        'N':'Garra Relámpago',
        'M':'Garra Trueno',
        'G':'Corte de Rayo',
        'P':'Garra de Fulgor',
    },
    [UNIQUE_ID_SKILLS.CURACION]: {
        'N':'Curación',
        'M':'Llamado de Sanación',
        'G':'Energía Restauradora',
        'P':'Toque de Rejuvenecimiento',
    },
    [UNIQUE_ID_SKILLS.REMOLINOS]: {
        'N':'Remolinos',
        'M':'Rapidez',
        'G':'Velocidad del Viento',
        'P':'Velocidad Huracanada',
    },
    [UNIQUE_ID_SKILLS.ATAQUE]: {
        'N':'Ataque',
        'M':'Poder',
        'G':'Superación',
        'P':'Ascendencia'
    },
}