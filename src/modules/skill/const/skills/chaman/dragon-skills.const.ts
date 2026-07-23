import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const DRAGON_SKILLS: SkillSummary[] = [
  {
    description: 'Dispara una figura de dragón para atacar frontalmente a tus enemigos.',
    id: UNIQUE_ID_SKILLS.DISPARO_DEL_DRAGON,
    type: 'damage',
    mana: { type: 'instant', amount: 0 },
    weaponRestricted: ['campana','fan']
  },
  {

    description: 'Usa el talismán para herir a tus enemigos.',
    id: UNIQUE_ID_SKILLS.TALISMAN_VOLADOR,
    type: 'damage',
    mana: { type: 'instant', amount: 0 },
    weaponRestricted: ['campana','fan']
  },
  {

    description: 'Ataca a tus enemigos con la figura de un dragón.',
    id: UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON,
    type: 'damage',
    mana: { type: 'instant', amount: 0 },
    weaponRestricted: ['campana','fan']
  },
  {
    description: 'Obten posibilidades de generar golpes criticos con el poder del dragón.',
    id: UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON,
    type: 'aura',
    mana: {type: 'instant',amount:0},
    tags: ['aura','defensive']
  },
  {
    description: 'Ganas resistencia a ataques fisicos mediante un círculo de protección.',
    id: UNIQUE_ID_SKILLS.BENDICION,
    type: 'aura',
    mana: {type: 'instant',amount:0},
    tags: ['aura','defensive']
  },
  {
    description: 'Ganas probabilidad de reflectar ataques fisicos mediante un círculo reflectante.',
    id: UNIQUE_ID_SKILLS.REFLECTAR,
    type: 'aura',
    mana: {type: 'instant',amount:0},
    tags: ['aura','defensive']
  },
]