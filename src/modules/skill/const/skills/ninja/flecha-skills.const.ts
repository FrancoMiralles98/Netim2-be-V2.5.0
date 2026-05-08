import { SkillType } from "src/modules/skill/types/skill.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/unique-id-skill.enum";

export const FLECHA_SKILLS: SkillType[] = [
    {
      nombre: 'Disparo Repetido',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 14,
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
      descripcion: 'Dispara varias flechas a un enemigo.',
      escalado: {},
      idSkill: UNIQUE_ID_SKILLS.DISPARO_REPETIDO,
    },
    {
      nombre: 'Flecha de Fuego',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 17,
      bonus_efecto: {
        penetracion_habilidad: 0,
        desmayo: 0,
        incendio: 10,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      idPosition: 2,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Lanza un flecha ardiente contra un objetivo. Al impactar sobre él, esta estalla causando daño. y con posibilidades de incendiarlo.',
      escalado: {},
      idSkill: UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO,
    },
    {
      nombre: 'Flecha Venenosa',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 20,
      bonus_efecto: {
        penetracion_habilidad: 0,
        desmayo: 100,
        incendio: 0,
        retardo: 0,
        veneno: 3,
        sangrado:0
      },
      idPosition: 3,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Dispara una flecha que puede envenenar al objetivo a la vez que le causa daño por impacto y por veneno. Además,deja apagado al objetivo.',
      escalado: {},
      idSkill: UNIQUE_ID_SKILLS.FLECHA_VENENOSA,
    },
    {
      nombre: 'Lluvia de Flechas',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 14,
      bonus_efecto: {
        penetracion_habilidad: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      bonus_damage: {
        type: 'tier',
        value: {}
      },
      idPosition: 4,
      type: 'Daño',
      icon: { x: 0, y: 0 },
      descripcion:
        'Con un solo disparo, lanzará varias flechas que impactaran al objetivo,con posbilidades de multiplicar el daño dependiendo de las flechas lanzadas. ',
      escalado: {},
      idSkill: UNIQUE_ID_SKILLS.LLUVIA_DE_FLECHAS,
    },
    {
      nombre: 'Camino Pluma',
      lv: 0,
      buffos: {
        vm: 0,
      },
      idPosition: 5,
      type: 'Aura',
      icon: { x: 0, y: 0 },
      descripcion:
        'Aligera el cuerpo para aumentar la velocidad de movimiento.',
      escalado: {},
      idSkill: UNIQUE_ID_SKILLS.CAMINO_PLUMA,
    },
  ]