import { Stats } from "netim2-shared";

/**
 * Estructura general de la propiedad `Stats` del character
 */
export const GENERAL_CHARACTER_STATS: Stats = {
    general: {
        ad: { min: 0, max: 0 },
        ap: { min: 0, max: 0 },
        mana: {actual: 0, max: 0},
        regen_mana: 0,
        def: 0,
        hp: { actual: 0, max: 0 },
        regen_hp: 0,
        va: 0,
        vh: 0,
        vm: 0
    },
    bonus: {
        daño: {
            animales: 0,
            chaman: 0,
            critico: 0,
            demonios: 0,
            bonus_estado: 0,
            bonus_fuego: 0,
            bonus_veneno: 0,
            daño_critico: 0,
            penetracion_habilidad: 0,
            doble_golpe: 0,
            guerrero: 0,
            habilidad: 0,
            bonus_sangrado: 0,
            duracion_estado: 0,
            electrico: 0,
            sangrado: 0,
            incendio: 0,
            media: 0,
            medio_humanos: 0,
            misticos: 0,
            monstruos: 0,
            ninja: 0,
            orcos: 0,
            penetracion: 0,
            sura: 0,
            veneno: 0
        },
        defensa: {
            bloquear_ataques: 0,
            def_campana: 0,
            def_electrico: 0,
            mana_cost: 0,
            porcentage_mana_cost: 0,
            def_daga: 0,
            damage_taken: 0,
            robo_vida: 0,
            vampirismo_hechizo: 0,
            def_desmayo: 0,
            def_hab: 0,
            def_incendio: 0,
            corta_curacion: 0,
            def_sangrado: 0,
            def_media: 0,
            def_retardo: 0,
            def_chaman: 0,
            def_guerrero: 0,
            def_ninja: 0,
            def_sura: 0,
            def_veneno: 0,
            def_dos_manos: 0,
            def_espada: 0,
            esquivar_ataques: 0,
            def_fan: 0,
            def_flecha: 0,
            def_magia: 0,
            reflectar: 0,
        },
        cc: {
            desmayo: 0,
            retardo: 0
        },
        miscs: {
            chances_exp: 0,
            chances_objetos: 0,
            chances_raros: 0,
            chances_yang: 0,
            bonus_exp: 0,
            bonus_yang: 0,
            time_reduction: 0,
        }
    }
}