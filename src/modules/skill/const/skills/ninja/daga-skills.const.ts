import { SkillType } from "src/modules/skill/types/const/skill.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const DAGA_SKILLS: SkillType[] = [
    {
      nombre: 'Emboscada',
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
        sangrado:0
      },
      bonus_damage: {
        type: 'chance',
        value: 0,
        multi: 0
      },
      idPosition: 1,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Haz un ataque preciso y genera mucho daño, probabilidad de generar golpe mortal (+40% de daño)',
      
      idSkill: UNIQUE_ID_SKILLS.EMBOSCADA,
    },
    {
      nombre: 'Daga Rodante',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 18,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 1,
        sangrado:0
      },
      bonus_damage: {
        
        type: 'tier',
        value: {}
      },
      idPosition: 2,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Girar alrededor del enemigo con una daga y ten probabilidades de generar múltiples daños y causar veneno.',
      
      idSkill: UNIQUE_ID_SKILLS.DAGA_RODANTE,
    },
    {
      nombre: 'Nube Tóxica',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ap',
      cd: 18,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 1,
        sangrado:0
      },
      idPosition: 3,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Realiza nubes venenosas alrededor del enemigo para intoxicarlo.',
      
      idSkill: UNIQUE_ID_SKILLS.NUBE_TOXICA,
    },
    {
      nombre: 'Ataque Rápido',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 16,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado:0
      },
      idPosition: 4,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Aproximación rápida al enemigo y realizando un ataque sin que el enemigo se de cuenta.',
      
      idSkill: UNIQUE_ID_SKILLS.ATAQUE_RAPIDO,
    },

    {
      nombre: 'Camuflaje',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 20,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado:0
      },
      idPosition: 5,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Camufalte para que el enemigo no te vea y aumenta tu daño en tu siguiente habilidad.',
      
      idSkill: UNIQUE_ID_SKILLS.CAMUFLAJE,
    },
  ]