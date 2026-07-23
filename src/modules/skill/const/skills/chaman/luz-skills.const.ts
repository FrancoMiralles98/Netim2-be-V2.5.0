import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const LUZ_SKILLS: SkillSummary[] = [
  {
    type: 'damage',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['campana','fan'],
    description: 'Evoca un relámpago del cielo.',
    id: UNIQUE_ID_SKILLS.LLAMADA_RELAMPAGO,
  },
  {

    type: 'damage',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['campana','fan'],
    description: 'Canaliza tu arma para generar un ataque con relámpagos.',
    id: UNIQUE_ID_SKILLS.TIRO_RELAMPAGO,
  },
  {
    type: 'damage',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['campana','fan'],
    description:
      'Convocas un relampago para dividirlo y lanzarlo al objetivo.',
    id: UNIQUE_ID_SKILLS.GARRA_RELAMPAGO,
  },
  {

    type: 'heal',
    mana: {type: 'instant',amount: 0},
    weaponRestricted: ['campana','fan'],
    description: 'Cura las heridas con la ayuda de la luz.',
    id: UNIQUE_ID_SKILLS.CURACION,
  },
  {
    type: 'aura',
    mana: {type: 'instant',amount: 0},
    description:
      'Obten el poder del viento e incrementa tu velocidad de movimiento y de hechizo.',
    id: UNIQUE_ID_SKILLS.REMOLINOS,
    tags: ['aura','defensive']
  },
  {
    type: 'aura',
    mana: {type: 'instant',amount: 0},
    description: 'Obten AD gracias al poder de la Luz.',
    id: UNIQUE_ID_SKILLS.ATAQUE,
    tags: ['aura','offensive']
  },
]