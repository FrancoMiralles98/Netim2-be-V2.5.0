import { EQUIP_RULES } from "src/modules/item/config/items-rule.const";
import { createPiedraItem } from "src/modules/item/factories/item-builder";
import { PiedraType } from "src/modules/item/types/entities-props/piedra.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const PIEDRA_LIST: PiedraType[] = [
    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_FUERZA,
        name: 'Piedra de Fuerza',
        img: '/itemsUtility/piedras/Piedra_Fuerza.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_IRA,
        name: 'Piedra de Ira',
        img: '/itemsUtility/piedras/Piedra_Ira.png',
        restricted: ["arma"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CONTRA_GUERREROS,
        name: 'Piedra contra Guerreros',
        img: '/itemsUtility/piedras/Piedra_Guerrero.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DIABLO,
        name: 'Piedra Diablo',
        img: '/itemsUtility/piedras/Piedra_Diablo.png',
        restricted: ["arma"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_INTELIGENCIA,
        name: 'Piedra de Inteligencia',
        img: '/itemsUtility/piedras/Piedra_INT.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_DESTREZA,
        name: 'Piedra de Destreza',
        img: '/itemsUtility/piedras/Piedra_DEX.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_VITALIDAD,
        name: 'Piedra de Vitalidad',
        img: '/itemsUtility/piedras/Piedra_VIT.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_REGENERACION,
        name: 'Piedra de Regeneración',
        img: '/itemsUtility/piedras/Piedra_Regen.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_VENENO,
        name: 'Piedra de Veneno',
        img: '/itemsUtility/piedras/Piedra_Veneno.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_FUEGO,
        name: 'Piedra de Fuego',
        img: '/itemsUtility/piedras/Piedra_Fuego.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_MAGICA,
        name: 'Piedra Magica',
        img: '/itemsUtility/piedras/Piedra_Magia.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DEF_CAMPANA,
        name: 'Piedra Def Campana',
        img: '/itemsUtility/piedras/Piedra_Campana.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DEF_DAGA,
        name: 'Piedra Def Daga',
        img: '/itemsUtility/piedras/Piedra_Daga.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DEF_DOS_MANOS,
        name: 'Piedra Def Dos Manos',
        img: '/itemsUtility/piedras/Piedra_Dos_Manos.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DEF_FAN,
        name: 'Piedra Def Fan',
        img: '/itemsUtility/piedras/Piedra_Fan.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DEF_FLECHA,
        name: 'Piedra Def Flecha',
        img: '/itemsUtility/piedras/Piedra_Flecha.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_RAPIDEZ,
        name: 'Piedra de Rapidez',
        img: '/itemsUtility/piedras/Piedra_Rapidez.png',
        restricted: ["armadura"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_DUREZA,
        name: 'Piedra de Dureza',
        img: '/itemsUtility/piedras/Piedra_Dureza.png',
        restricted: ["armadura"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DEF_ESPADA,
        name: 'Piedra def Espada',
        img: '/itemsUtility/piedras/Piedra_Espada.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_VIDA,
        name: 'Piedra de Vida',
        img: '/itemsUtility/piedras/Piedra_Vida.png',
        restricted: ["armadura"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_EVITAR_FLECHAS,
        name: 'Piedra de Evitar Flechas',
        img: '/itemsUtility/piedras/Piedra_Evitar_Flecha.png',
        restricted: ["armadura"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CONTRA_NINJAS,
        name: 'Piedra contra Ninjas',
        img: '/itemsUtility/piedras/Piedra_Ninja.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CONTRA_CHAMANES,
        name: 'Piedra contra Chamanes',
        img: '/itemsUtility/piedras/Piedra_Chaman.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CONTRA_SURAS,
        name: 'Piedra contra Suras',
        img: '/itemsUtility/piedras/Piedra_Sura.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_HECHIZOS,
        name: 'Piedra de Hechizos',
        img: '/itemsUtility/piedras/Piedra_Hechizos.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_GOLPES_MORTALES,
        name: 'Piedra de Golpes Mortales',
        img: '/itemsUtility/piedras/Piedra_Mortales.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_OBSIDIANA,
        name: 'Piedra de Obsidiana',
        img: '/itemsUtility/piedras/Piedra_Obsidiana.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_DE_LA_MUERTE,
        name: 'Piedra de la Muerte',
        img: '/itemsUtility/piedras/Piedra_Muerte.png',
        restricted: ["arma"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_PENETRANTE,
        name: 'Piedra Penetrante',
        img: '/itemsUtility/piedras/Piedra_Penetrante.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CRANEO_SANGRIENTADA,
        name: 'Piedra Craneo Sangrientada',
        img: '/itemsUtility/piedras/Piedra_Craneo_Sangrientada.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CRANEO_ENVENENADA,
        name: 'Piedra Craneo Envenenada',
        img: '/itemsUtility/piedras/Piedra_Craneo_Envenenada.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_CRANEO_INCENDIADA,
        name: 'Piedra Craneo Incendiada',
        img: '/itemsUtility/piedras/Piedra_Craneo_Incendiada.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_ECLIPSE,
        name: 'Piedra Eclipse',
        img: '/itemsUtility/piedras/Piedra_Eclipse.png',
        restricted: ["arma"],
        price: 1000,
        upgradeMax: EQUIP_RULES.MAX_NORMAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_LAGRIMA_DE_LA_LUNA,
        name: 'Piedra Lagrima de la Luna',
        img: '/itemsUtility/piedras/Piedra_Lagrima_de_la_Luna.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),

    createPiedraItem({
        idItem: IdItem.PIEDRA_SANGRE_HELADA,
        name: 'Piedra Sangre Helada',
        img: '/itemsUtility/piedras/piedra_def_sangrado.png',
        restricted: ["armadura"],
        price: 2000,
        upgradeMax: EQUIP_RULES.MAX_SPECIAL_PIEDRAS_UPGRADE_LV,
        description: '',
    }),
]