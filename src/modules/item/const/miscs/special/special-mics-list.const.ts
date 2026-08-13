import { IdItem, UtilityType } from "netim2-shared";
import { createGenericUtilityItem } from "src/modules/item/factories/item-builder";


export const SPECIAL_MISCS: UtilityType[] = [
    createGenericUtilityItem({
        name: 'Fuerza Verde',
        description: 'Con algo de suerte añade un bonus a uno de tus objetos, hasta un máximo de 4 bonus. Solo objetos de nivel 15 o inferior.',
        img: '/itemsUtility/Fuerza_Verde.png',
        maxCantidad: 200,
        price: 200,
        idItem: IdItem.FUERZA_VERDE
    }),
    createGenericUtilityItem({
        name: 'Magia Verde',
        description: 'Elimina los bonus de uno de tus objetos y añade nuevos. Solo objetos de nivel 15 o inferior.',
        img: '/itemsUtility/Magia_Verde.png',
        maxCantidad: 200,
        price: 100,
        idItem: IdItem.MAGIA_VERDE
    }),
    createGenericUtilityItem({
        name: 'Manual del Herrero',
        description: 'El libro está conectado con el alma de un viejo herrero. Mediante su uso en el herrero aumenta las posibilidades de mejorar el artículo.',
        img: '/itemsUtility/Manual_del_Herrero.png',
        maxCantidad: 5,
        price: 2000,
        idItem: IdItem.MANUAL_DEL_HERRERO
    }),
    createGenericUtilityItem({
        name: 'Objeto Encantado',
        description: 'Elimina los bonos de uno de tus objetos y añade nuevos.',
        img: '/itemsUtility/Objeto_Encantado.png',
        maxCantidad: 200,
        price: 300,
        idItem: IdItem.OBJETO_ENCANTADO
    }),
    createGenericUtilityItem({
        name: 'Objeto de Coacción',
        description: 'Con algo de suerte añade un bonus a uno de tus objetos.',
        img: '/itemsUtility/Objeto-de-coaccion.png',
        maxCantidad: 200,
        price: 400,
        idItem: IdItem.OBJETO_DE_COACCION
    }),
    createGenericUtilityItem({
        name: 'Manual de la Piedra',
        description: 'Elimina una las piedras rotas de un objeto. Con eso tendrás otra oportunidad de mejorar tu arma o armadura.',
        img: '/itemsUtility/Manual_de_la_Piedra.png',
        maxCantidad: 10,
        price: 3500,
        idItem: IdItem.MANUAL_DE_LA_PIEDRA
    }),
    createGenericUtilityItem({
        name: 'Bola Bendicion',
        description: 'Con este objeto podras añadir el 5to bonus a tu equipo.',
        img: '/itemsUtility/Bola_Bendicion.png',
        maxCantidad: 10,
        price: 5000,
        idItem: IdItem.BOLA_BENDICION
    }),
    createGenericUtilityItem({
        name: 'Piedra Alma',
        description: 'Esta piedra tiene guardada una alma poderosa en su interior. Puedes usarla para mejorar tus habilidades al la perfección.',
        img: '/itemsUtility/Piedra_Alma.png',
        maxCantidad: 10,
        price: 5000,
        idItem: IdItem.PIEDRA_ALMA
    }),
    createGenericUtilityItem({
        name: 'Pergamino de Corrección',
        description: 'Este pergamino puede extraer de un objeto la última piedra añadida.',
        img: '/itemsUtility/Pergamino_de_Corrección.png',
        maxCantidad: 10,
        price: 5000,
        idItem: IdItem.PERGAMINO_DE_CORRECCION
    }),
    createGenericUtilityItem({
        name: 'Objeto de Ascendencia',
        description: 'Este objeto permite añadir el 6to y 7to bonus al item.',
        img: '/itemsUtility/Objeto_de_Ascendencia.png',
        maxCantidad: 10,
        price: 3000,
        idItem: IdItem.OBJETO_DE_ASCENDENCIA
    }),
    createGenericUtilityItem({
        name: 'Objeto Místico',
        description: 'Este objeto permite cambiar los bonus 6to y 7to para añadir unos nuevos.',
        img: '/itemsUtility/Objeto_Mistico.png',
        maxCantidad: 10,
        price: 3000,
        idItem: IdItem.OBJETO_MISTICO
    }),
    createGenericUtilityItem({
        name: 'Pergamino Bendición',
        description: 'Reduce el riesgo de destruir un objeto si la mejora falla. El coste de esto es que la calidad del objeto es reducida en 1 punto.',
        img: '/itemsUtility/Pergamino_Bendición.png',
        maxCantidad: 10,
        price: 4000,
        idItem: IdItem.PERGAMINO_BENDICION
    }),
    createGenericUtilityItem({
        name: 'Mineral de Hierro Mágico',
        description: 'Reduce el riesgo de destruir un objeto si la mejora falla y aumenta las chances de mejora. El coste de esto es que se duplica los requerimientos necesarios para que mejore.',
        img: '/itemsUtility/Mineral_de_Hierro_Mágico.png',
        maxCantidad: 10,
        price: 5000,
        idItem: IdItem.MINERAL_DE_HIERRO_MAGICO
    }),
    createGenericUtilityItem({
        name: 'Trozo de oro',
        description: 'Un trozo de oro que nunca se ha elaborado. Se vende en una tienda a un precio muy alto.',
        img: '/itemsUtility/trozo_de_oro.png',
        maxCantidad: 10,
        price: 40000,
        idItem: IdItem.TROZO_DE_ORO
    }),
    createGenericUtilityItem({
        name: 'Alma Corrupta Petrificada',
        description: 'Un alma encerrada con un poder desequilibrante, aún se le pueden escuchar susurrar. Corrompe un objeto, modificándolo de forma impredecible.',
        img: '/itemsUtility/Alma_Corrupta_Petrificada.png',
        maxCantidad: 30,
        price: 2000,
        leyenda: "Tus deseos te engañarán.",
        corrupt: true,
        idItem: IdItem.ALMA_CORRUPTA_PETRIFICADA
    }),
    createGenericUtilityItem({
        name: 'Recuerdo Corrupto Petrificado',
        description: 'Un Recuerdo de algún ser perdido en la corrupción, aún se le pueden escuchar susurrar. Modifica Bonus Explicitos Corruptos',
        img: '/itemsUtility/Recurdo_Corrupto_Petrificado.png',
        maxCantidad: 30,
        price: 1000,
        leyenda: "Acciones simples pueden llevar al mundo a una muerte prematura.",
        corrupt: true,
        idItem: IdItem.RECURDO_CORRUPTO_PETRIFICADO
    }),
    createGenericUtilityItem({
        name: 'Fragmento parcialmente corrupto',
        description: 'Con este fragmento que guarda un poco de su energia, el Encantador puede añadir, en lo posible, un bonus a un item corrupto.',
        img: '/itemsUtility/Fragmento_parcialmente_corrupto.png',
        maxCantidad: 30,
        price: 500,
        idItem: IdItem.FRAGMENTO_PARCIALMENTE_CORRUPTO
    }),
    createGenericUtilityItem({
        name: 'Veta sin energia',
        description: 'Gracias a las cualidades de esta inusual veta, el Encantador puede eliminar y añadir nuevos bonus a un item corrupto.',
        img: '/itemsUtility/Veta_sin_energia.png',
        maxCantidad: 30,
        price: 400,
        idItem: IdItem.VETA_SIN_ENERGIA
    }),
    createGenericUtilityItem({
        name: 'Sello Desconocido',
        description: 'Una reliquia que tiene grabada un sello de alguna civilización desconocida.',
        img: '/itemsUtility/llave_mazmorra_monos.png',
        maxCantidad: 20,
        price: 2000,
        idItem: IdItem.SELLO_DESCONOCIDO
    }),
    createGenericUtilityItem({
        name: 'Piedra Glifo',
        description: 'Una piedra utilizada para para abrir alguna entrada secreta.',
        img: '/itemsUtility/Piedra_glifo.png',
        maxCantidad: 20,
        price: 2000,
        idItem: IdItem.PIEDRA_GLIFO
    }),
    createGenericUtilityItem({
        name: 'Cabeza Reducida',
        description: 'Esta cabeza de demonio reducida abre el sello para entrar a la Torre Demoniaca.',
        img: '/itemsUtility/Cabeza_reducida.png',
        maxCantidad: 20,
        price: 2000,
        idItem: IdItem.CABEZA_REDUCIDA
    })
]
