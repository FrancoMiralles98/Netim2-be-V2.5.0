import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { SkillSummary } from "src/modules/skill/types/summary-skills.types";


export const ESPEJO_SKILLS: SkillSummary[] = [
  {
    type: 'damage',
    mana: { type: 'instant', amount: 0 },
    weaponRestricted: [],
    description: 'Realiza una gran explosión con la yema de tus dedos.',

    id: UNIQUE_ID_SKILLS.GOLPE_DE_DEDO,
  },
  {
    type: 'damage',
    mana: { type: 'instant', amount: 0 },
    weaponRestricted: ['espada'],
    description: 'Provoca un poderoso tornado para derrotar a varios enemigos.',

    id: UNIQUE_ID_SKILLS.REMOLINO_DRAGON,
  },
  {
    type: 'damage',
    mana: { type: 'instant', amount: 0 },
    weaponRestricted: [],
    description: 'Lanza un orbe de anti-magia a tu enemigo.',

    id: UNIQUE_ID_SKILLS.ANULAR_MAGIA,
  },
  {
    type: 'aura',
    tags: ['aura','offensive'],
    mana: { type: 'upkeep', initialAmount: 0, amountPerTurn: 0 },
    description:
      'Encanta tu espada con magia oscura,incrementa tu valor de ataque y absorberas HP del daño realizado.',

    id: UNIQUE_ID_SKILLS.HOJA_ENCANTADA,
  },
  {

    type: 'aura',
    tags: ['aura','defensive'],
    mana: { type: 'instant', amount: 0 },
    description: 'Proteje tu cuerpo con una armadura oscura.',

    id: UNIQUE_ID_SKILLS.ARMADURA_ENCANTADA,
  },
  {
    type: 'aura',
    tags: ['aura','defensive'],
    mana: { type: 'instant', amount: 0 },
    description:
      'Rodeate de una aura maldita y debilita las habilidades de los enemigos que te atacan.',

    id: UNIQUE_ID_SKILLS.MIEDO,
  },
]