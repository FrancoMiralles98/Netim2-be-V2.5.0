/**
 * @see - en el cliente cada clase tiene una imagen donde se encuentran todas las skills de dicha clase
 * y con todas sus versiones dependiendo del nivel de la misma, estos valores fijos determinan cuanto tiene que moverse
 * la imagen (en px) para poder seleccionar el recuadro que identifica la skill
 *  */

/**
 * @description - objeto con los valores del eje Y a la que representa cada skill segun su 'idPosition'
 */
const ICON_POSITION_Y = {
    1: 0,
    2: 35,
    3: 72,
    4: 0,
    5: 36,
    6: 71
} as const

/**
 * @description - por como esta distribuido los iconos de las skills en la imagen, se agrupan en 2 grupos
 * ya que comparten el mismo eje x (solo que con un eje Y diferente) solo cambia el valor segun el nivel
 * de la skills, aca lo unico que nos interesa es si es un numero o que letra tiene cuando se masteriza
 */
const ICON_POSITION_X = {
    3: { // idPosition con id <=  3
        'number': 0,
        'M': 37,
        'G': 74,
        'P': 74
    },
    6: { // idPosition > 3 y <= 6
        'number': 112,
        'M': 149,
        'G': 187,
        'P': 187
    },
} as const