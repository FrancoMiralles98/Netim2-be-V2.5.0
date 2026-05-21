import { SkillType } from "src/modules/skill/types/const/skill.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const MENTAL_SKILLS: SkillType[] = [
      {
      nombre: 'Tocón',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 18,
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 15,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
     
      idPosition: 2,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Genera una onda expansiva con tu pisada, probabilidad de desmayo. ',
      idSkill: UNIQUE_ID_SKILLS.TOCON,
    },
    {
      nombre: 'Pulso Espiritual',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 17,
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
      descripcion: 'Canaliza tu espiritu y haz un poderoso ataque.',
      idSkill: UNIQUE_ID_SKILLS.PULSO_ESPIRITUAL,
    },
    {
      nombre: 'Golpe',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 13,
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
      descripcion: 'Golpea contra el suelo y genera ondas de choque',
      idSkill: UNIQUE_ID_SKILLS.GOLPE,
    },
    {
      nombre: 'Golpe de Espada',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 14,
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
      descripcion: 'Lanza un onda magica que provoca desmayo al enemigo',
      idSkill: UNIQUE_ID_SKILLS.GOLPE_DE_ESPADA,
    },
    {
      nombre: 'Cuerpo Fuerte',
      lv: 0,
      buffos: {
        def_incendio: 0,
        def_veneno: 0,
        def_sangrado: 0,
        regen_hp: 0
      },
      idPosition: 5,
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion:
        'Generas un grito para ganar valor en batalla, aumenta tu defensa, y resistencia a desmayo, pero reduce tu velocidad de movimiento.',
      idSkill: UNIQUE_ID_SKILLS.CUERPO_FUERTE,
    },
  ]