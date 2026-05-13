import { SkillType } from "src/modules/skill/types/const/skill.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const DRAGON_SKILLS: SkillType[] = [
    {
      nombre: 'Disparo del Dragón',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ap',
      cd: 8,
      bonus_efecto: {
        penetracion_habilidad: 0,
        desmayo: 0,
        incendio: 1,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      
      idPosition: 4,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Dispara una figura de dragón para atacar frontalmente a tus enemigos.',
      idSkill: UNIQUE_ID_SKILLS.DISPARO_DEL_DRAGON,
    },
    {
      nombre: 'Talismán Volador',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ap',
      cd: 7,
      bonus_efecto: {
        penetracion_habilidad: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      
      idPosition: 1,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion: 'Usa el talismán para herir a tus enemigos.',
      idSkill: UNIQUE_ID_SKILLS.TALISMAN_VOLADOR,
    },
    {
      nombre: 'Rugido del Dragón',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ap',
      cd: 20,
      bonus_efecto: {
        penetracion_habilidad: 0,
        desmayo: 0,
        incendio: 5,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      
      idPosition: 2,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion: 'Ataca a tus enemigos con la figura de un dragón.',
      idSkill: UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON,
    },
    {
      nombre: 'Fuerza de Dragón',
      lv: 0,
      buffos: {
        critico: 0,
      },
      idPosition: 6,
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion:
        'Obten posibilidades de generar golpes criticos con el poder del dragón.',
      idSkill: UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON,
    },
    {
      nombre: 'Bendición',
      lv: 0,
      buffos: {
        def_media: 0,
      },
      idPosition: 5,
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion:
        'Ganas resistencia a ataques fisicos mediante un círculo de protección.',
      idSkill: UNIQUE_ID_SKILLS.BENDICION,
    },
    {
      nombre: 'Reflectar',
      lv: 0,
      buffos: {
        reflectar: 0,
      },
      idPosition: 3,
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion:
        'Ganas probabilidad de reflectar ataques fisicos mediante un círculo reflectante.',
      idSkill: UNIQUE_ID_SKILLS.REFLECTAR,
    },
  ]