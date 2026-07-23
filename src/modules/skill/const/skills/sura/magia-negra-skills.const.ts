import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";

export const MAGIA_NEGRA_SKILLS: SkillSummary[] = [
  {
    type: 'damage',
    mana: {type:'instant',amount:0},
    weaponRestricted: ['espada'],
    description: 'Lanza fuerza oscura para herir a los enemigos.',

    id: UNIQUE_ID_SKILLS.GOLPE_OSCURO,
  },
  {
    type: 'damage',
    mana: {type:'upkeep',initialAmount:0,amountPerTurn:0},
    weaponRestricted: ['espada'],
    description: 'Crea un espíritu de la llama que ataca a los enemigos.',
    id: UNIQUE_ID_SKILLS.ESPIRITU_DE_LA_LLAMA,
  },
  {
    type: 'damage',
    mana: {type:'instant',amount:0},
    weaponRestricted: ['espada'],
    description:
      'Lanza espíritus oscuros para herir a los enemigos y poder relantizarlos.',

    id: UNIQUE_ID_SKILLS.GOLPE_ESPIRITUAL,
  },
  {
    type: 'damage',
    mana: {type:'instant',amount:0},
    weaponRestricted: ['espada'],
    description: 'Quema a tus enemigos con una explosión.',

    id: UNIQUE_ID_SKILLS.GOLPE_DE_LLAMA,
  },
  {
    type: 'damage',
    mana: {type:'instant',amount:0},
    weaponRestricted: ['espada'],
    description: 'Lanza un globo oscuro para herir a tus enemigos.',

    id: UNIQUE_ID_SKILLS.ORBE_OSCURO,
  },
  {
    type: 'aura',
    tags: ['aura','defensive'],
    mana: {type:'instant',amount:0},
    description: 'Protégete con el señor oscuro de ataques.',
    id: UNIQUE_ID_SKILLS.PROTECCION_OSCURA,
  },
]