import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const DAGA_SKILLS: SkillSummary[] = [
  {

    type: 'damage',
    description:
      'Haz un ataque preciso y genera mucho daño, probabilidad de generar golpe mortal (+40% de daño)',

    id: UNIQUE_ID_SKILLS.EMBOSCADA,
  },
  {
    type: 'damage',
    description:
      'Girar alrededor del enemigo con una daga y ten probabilidades de generar múltiples daños y causar veneno.',

    id: UNIQUE_ID_SKILLS.DAGA_RODANTE,
  },
  {
    type: 'damage',
    description:
      'Realiza nubes venenosas alrededor del enemigo para intoxicarlo.',

    id: UNIQUE_ID_SKILLS.NUBE_TOXICA,
  },
  {
    type: 'damage',
    description:
      'Aproximación rápida al enemigo y realizando un ataque sin que el enemigo se de cuenta.',

    id: UNIQUE_ID_SKILLS.ATAQUE_RAPIDO,
  },

  {
    type: 'damage',
    description:
      'Camufalte para que el enemigo no te vea y aumenta tu daño en tu siguiente habilidad.',

    id: UNIQUE_ID_SKILLS.CAMUFLAJE,
  },
]