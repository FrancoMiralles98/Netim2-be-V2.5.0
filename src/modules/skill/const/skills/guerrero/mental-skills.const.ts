import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const MENTAL_SKILLS: SkillSummary[] = [
      {
     
      type: 'damage',
      mana: {type: 'instant',amount: 0},
      weaponRestricted: ['dos_manos','espada'],
      description:
        'Genera una onda expansiva con tu pisada, probabilidad de desmayo. ',
      id: UNIQUE_ID_SKILLS.TOCON,
    },
    {
     
      type: 'damage',
      mana: {type: 'instant',amount: 0},
      weaponRestricted: ['dos_manos','espada'],
      description: 'Canaliza tu espiritu y haz un poderoso ataque.',
      id: UNIQUE_ID_SKILLS.PULSO_ESPIRITUAL,
    },
    {
     
      type: 'damage',
      mana: {type: 'instant',amount: 0},
      weaponRestricted: ['dos_manos','espada'],
      description: 'Golpea contra el suelo y genera ondas de choque',
      id: UNIQUE_ID_SKILLS.GOLPE,
    },
    {
     
      type: 'damage',
      mana: {type: 'instant',amount: 0},
      weaponRestricted: ['dos_manos','espada'],
      description: 'Lanza un onda magica que provoca desmayo al enemigo',
      id: UNIQUE_ID_SKILLS.GOLPE_DE_ESPADA,
    },
    {
      type: 'aura',
      duration: {
        turns: 1,
        type: 'turns'
      },
      tags: ['aura','defensive'],
      mana: {type: 'instant',amount:0},
      description:
        'Generas un grito para ganar valor en batalla, aumenta tu defensa, y resistencia a desmayo, pero reduce tu velocidad de movimiento.',
      id: UNIQUE_ID_SKILLS.CUERPO_FUERTE,
    },
  ]