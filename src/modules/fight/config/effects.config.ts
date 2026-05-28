/**
 * Configuración base de los efectos de daño del combate.
 *
 * Define el comportamiento, duración y escalados especiales
 * de veneno, incendio y sangrado.
 * 
 * @property {number} porcent_base_damage - Indica es escalado base que tiene el efecto, el valor es el procentaje
 * del daño que lo ocasiono, 
 *  @example - 
 *   Daño de la habilidad / ataque basico => 100
 *   Efecto aplicado => "Veneno"
 *   Daño de veneno x cada turno => 13% de 100 = 13 (este valor puede aumentar con bonuses especificos)
 * 
 * @property {number} turns - La cantidad de turnos que dura el efecto (este valor puede aumentar con bonuses especificos)
 */
export const DAMAGE_EFFECTS_CONFIG = {
    veneno: {
        porcent_base_damage: 13,
        //mientras este activo reduce las curaciones un 30% 
        corta_cura_porcent: 30, 
        turns: 10 
    },
    incendio: {
        porcent_base_damage: 20,
        //si se aplica incendio y el enemigo ya esta incendiado se añade un valor extra de escalado 
        extra_porcent_base_dmg: 10,
        turns: 5,
    },
    sangrado: {
        porcent_base_damage: 8,
        //En este efecto aumenta el daño del escalado segun la velocidad de movimiento del enemigo
        extra_porcent_base_dmg_per_vm: 0.3,
        turns: 7
    },
}

/**
 * Configuración base de los efectos de control de masas (CC).
 *
 * Define las reducciones de estadísticas y duración
 * de efectos como retardo y desmayo.
 *
 * @property {number} turns - La cantidad de turnos que dura el efecto (este valor puede aumentar con bonuses especificos)
 */
export const CC_EFFECTS_CONFIG = {
    retardo: {
        va: 25, //reduce la velocidad de ataque un 25%
        vm: 50, //reduce la velocidad de movimiento en 50 puntos
        vh: 25, //reduce la velocidad de hechizo en un 25%
        turns: 6
    },
    desmayo: { //desmayo hace que en enemigo no pueda realizar ninguna accion por x turnos
        turns: 2 
    },
}

/**
 * Configuración base de efectos especiales de combate .
 *
 */
export const BONUS_EFFECTS_CONFIG = {
    //la "penetracion" solo se aplica en ataques basicos
    penetracion: {
        reduction_bonus_def: 50, //reduce la defensa porcentual (def bonus) del enemigo en un 50%
        reduction_flat_def: 50 //reduce la armadura del enemigo en un 50%
    },
    corta_curacion: {
        porcent: 50 //si se aplica, reduce cualquier curacion que reciba el enemigo en un 50%
    },
    reflectar: {
        porcent_dmg_to_reflect: 15 //si se aplica, el enemigo recibe un 15% del daño que causo
    }
}