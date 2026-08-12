import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const DAGA_SKILLS: SkillSummary[] = [
  {

    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['daga','espada'],
    description:
      'Haz un ataque preciso y genera mucho daño, probabilidad de generar golpe mortal (+40% de daño)',

    id: UNIQUE_ID_SKILLS.EMBOSCADA,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['daga','espada'],
    description:
      'Girar alrededor del enemigo con una daga y ten probabilidades de generar múltiples daños y causar veneno.',

    id: UNIQUE_ID_SKILLS.DAGA_RODANTE,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: [],
    description:
      'Realiza nubes venenosas alrededor del enemigo para intoxicarlo.',

    id: UNIQUE_ID_SKILLS.NUBE_TOXICA,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount:0},
    weaponRestricted: ['daga','espada'],
    description:
      'Aproximación rápida al enemigo y realizando un ataque sin que el enemigo se de cuenta.',

    id: UNIQUE_ID_SKILLS.ATAQUE_RAPIDO,
  },
  {
    type: 'buff',
    mana: {type: 'instant',amount:0},
    description:
      'Camufalte para que el enemigo no te vea y aumenta tu daño en tu siguiente habilidad.',
    id: UNIQUE_ID_SKILLS.CAMUFLAJE,
    effects: [{
      consumeOn: 'skill_use',
      uses: 1,
      multiplier: 1,
      type: 'next_skill_damage_multiplier',
      allowedSkillIds: [
        UNIQUE_ID_SKILLS.EMBOSCADA,
        UNIQUE_ID_SKILLS.ATAQUE_RAPIDO
      ],
      description: 'Al activarse aumenta el daño de la siguiente habilidad ya se Emboscada o Ataque Rapido.'
    }]
  },
]