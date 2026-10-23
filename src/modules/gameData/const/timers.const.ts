/**
 * estos valores sirven para multiplicar el valor que tiene en timer_lv el character
 */
export const base_timers_pvm_multiplier = {
    mob: 1,
    netims: 2,
    boss: 4,
}

//Este es el timer unico de PVP, siempre es el mismo independientemente del nivel (en milisegundos)
export const timer_pvp = 5 * 60 * 1000 //ahora mismo 5 minutos