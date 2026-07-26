import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const FLECHA_SKILLS: SkillSummary[] = [
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['flecha'],
    description: 'Dispara varias flechas a un enemigo.',

    id: UNIQUE_ID_SKILLS.DISPARO_REPETIDO,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['flecha'],
    description:
      'Lanza un flecha ardiente contra un objetivo. Al impactar sobre él, esta estalla causando daño. y con posibilidades de incendiarlo.',

    id: UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['flecha'],
    description:
      'Dispara una flecha que puede envenenar al objetivo a la vez que le causa daño por impacto y por veneno. Además,deja apagado al objetivo.',

    id: UNIQUE_ID_SKILLS.FLECHA_VENENOSA,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['flecha'],
    description:
      'Con un solo disparo, lanzará varias flechas que impactaran al objetivo,con posbilidades de multiplicar el daño dependiendo de las flechas lanzadas. ',

    id: UNIQUE_ID_SKILLS.LLUVIA_DE_FLECHAS,
  },
  {
    type: 'aura',
    tags: ['aura','defensive'],
    duration: {
      turns: 1,
      type: 'turns'
    },
    mana: {type:"instant",amount:0},
    description:
      'Aligera el cuerpo para aumentar la velocidad de movimiento.',
    id: UNIQUE_ID_SKILLS.CAMINO_PLUMA,
  },
]