import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";

export const CORPORAL_SKILLS: SkillSummary[] = [
  {
    type: 'damage',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['dos_manos','espada'],
    description: 'Realiza un ataque frontal tres veces.',
    id: UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['dos_manos','espada'],
    description: 'Ataca rapidamente con tu cuerpo al oponente, causa desmayo.',
    id: UNIQUE_ID_SKILLS.ROCIADA,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['dos_manos','espada'],
    description: 'Gira la espada para atacar al enemigo.',
    id: UNIQUE_ID_SKILLS.GIRO_DE_ESPADA,
  },
  {
    type: 'aura',
    tags: ['aura','offensive'],
    mana: {type: 'instant',amount:0},
    description:
      'Entra en un estado de ira e incrementa tu velocidad de ataque, de movimiento a cambio de recibir más daño.',
    id: UNIQUE_ID_SKILLS.BERSEK,
  },
  {
    type: 'aura',
    tags: ['aura','offensive'],
    mana: {type: 'instant',amount:0},
    description: 'Canaliza tu poder en el arma y aumenta tu AD.',
    id: UNIQUE_ID_SKILLS.AURA_DE_ESPADA,
  },
]