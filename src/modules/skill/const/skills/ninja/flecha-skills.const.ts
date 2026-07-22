import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const FLECHA_SKILLS: SkillSummary[] = [
  {
    type: 'damage',
    description: 'Dispara varias flechas a un enemigo.',

    id: UNIQUE_ID_SKILLS.DISPARO_REPETIDO,
  },
  {
    type: 'damage',
    description:
      'Lanza un flecha ardiente contra un objetivo. Al impactar sobre él, esta estalla causando daño. y con posibilidades de incendiarlo.',

    id: UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO,
  },
  {
    type: 'damage',
    description:
      'Dispara una flecha que puede envenenar al objetivo a la vez que le causa daño por impacto y por veneno. Además,deja apagado al objetivo.',

    id: UNIQUE_ID_SKILLS.FLECHA_VENENOSA,
  },
  {
    type: 'damage',
    description:
      'Con un solo disparo, lanzará varias flechas que impactaran al objetivo,con posbilidades de multiplicar el daño dependiendo de las flechas lanzadas. ',

    id: UNIQUE_ID_SKILLS.LLUVIA_DE_FLECHAS,
  },
  {
    type: 'aura',
    description:
      'Aligera el cuerpo para aumentar la velocidad de movimiento.',

    id: UNIQUE_ID_SKILLS.CAMINO_PLUMA,
  },
]