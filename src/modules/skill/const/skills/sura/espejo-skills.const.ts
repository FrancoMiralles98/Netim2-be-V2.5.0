import { SkillType } from "src/modules/skill/types/const/skill.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

export const ESPEJO_SKILLS: SkillType[] = [
    {
      nombre: 'Golpe de Dedo',
      daño: {min:0,max:0},
      lv: 0,
      tipo_daño: 'ad',
      cd: 10,
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
      descripcion: 'Realiza una gran explosión con la yema de tus dedos.',
      
      idSkill: UNIQUE_ID_SKILLS.GOLPE_DE_DEDO,
    },
    {
      nombre: 'Remolino Dragón',
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
      descripcion:'Provoca un poderoso tornado para derrotar a varios enemigos.',
      icon: { x: 112, y: 0 },
      
      idSkill: UNIQUE_ID_SKILLS.REMOLINO_DRAGON,
    },
    {
      nombre: 'Anular Magia',
      lv: 0,
      daño: {min:0,max:0},
      cd: 12,
      tipo_daño: 'ap',
      bonus_efecto: {
        penetracion_habilidad:0,
        vampirismo_hechizo: 0,
        desmayo: 0,
        incendio: 0,
        retardo: 0,
        veneno: 0,
        sangrado: 0
      },
      idPosition: 6,
      type: 'Daño',
      descripcion: 'Lanza un orbe de anti-magia a tu enemigo.',
      icon: { x: 112, y: 36 },
      
      idSkill: UNIQUE_ID_SKILLS.ANULAR_MAGIA,
    },
    {
      nombre: 'Hoja Encantada',
      lv: 0,
      buffos: {
        media: 0,
        robo_vida: 0,
      },
      idPosition: 2,
      type: 'Aura',
      descripcion:
        'Encanta tu espada con magia oscura,incrementa tu valor de ataque y absorberas HP del daño realizado.',
      icon: { x: 0, y: 35 },
      
      idSkill: UNIQUE_ID_SKILLS.HOJA_ENCANTADA,
    },
    {
      nombre: 'Armadura Encantada',
      lv: 0,
      buffos: {
        def_media:0,
        reflectar: 0,
      },
      idPosition: 3,
      type: 'Aura',
      descripcion: 'Proteje tu cuerpo con una armadura oscura.',
      icon: { x: 0, y: 0 },
      
      idSkill: UNIQUE_ID_SKILLS.ARMADURA_ENCANTADA,
    },
    {
      nombre: 'Miedo',
      lv: 0,
      buffos: {
        bloquear_ataques: 0,
        esquivar_ataques: 0,
      },
      idPosition: 5,
      type: 'Aura',
      descripcion:
        'Rodeate de una aura maldita y debilita las habilidades de los enemigos que te atacan.',
      icon: { x: 112, y: 71 },
      
      idSkill: UNIQUE_ID_SKILLS.MIEDO,
    },
  ]