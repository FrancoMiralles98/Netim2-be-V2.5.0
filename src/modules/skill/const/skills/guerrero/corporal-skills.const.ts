import { SkillType } from "src/modules/skill/types/const/skill.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const CORPORAL_SKILLS: SkillType[] = [
    {
      nombre: 'Corte de Tres Maneras',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 12,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      
      idPosition: 1,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion: 'Realiza un ataque frontal tres veces.',
      idSkill: UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS,
    },
    {
      nombre: 'Rociada',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 16,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 100,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      
      idPosition: 3,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion: 'Ataca rapidamente con tu cuerpo al oponente, causa desmayo.',
      idSkill: UNIQUE_ID_SKILLS.ROCIADA,
    },
    {
      nombre: 'Giro de Espada',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 15,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      
      idPosition: 4,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion: 'Gira la espada para atacar al enemigo.',
      idSkill: UNIQUE_ID_SKILLS.GIRO_DE_ESPADA,
    },
    {
      nombre: 'Bersek',
      lv: 0,
      idPosition: 2,
      buffos: {
        vm: 0,
        va: 0,
        damage_taken: 0,
      },
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion:
        'Entra en un estado de ira e incrementa tu velocidad de ataque, de movimiento a cambio de recibir más daño.',
      idSkill: UNIQUE_ID_SKILLS.BERSEK,
    },
    {
      nombre: 'Aura de Espada',
      lv: 0,
      buffos: {
        media: 0,
      },
      idPosition: 5,
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion: 'Canaliza tu poder en el arma y aumenta tu AD.',
      idSkill: UNIQUE_ID_SKILLS.AURA_DE_ESPADA,
    },
  ]