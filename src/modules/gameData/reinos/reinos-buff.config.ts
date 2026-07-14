import { ReinosBuffType } from "netim2-shared";

/**
 * Configuración de buffos pasivos otorgados por pertenecer a un reino.
 *
 * Cada reino aplica bonus propios al personaje de forma permanente mientras
 * pertenezca a dicho reino
 */
export const ReinosBuff: ReinosBuffType = {
    shinsoo: {
        bonus_yang: 10,
        chances_objetos: 10,
        chances_raros: 10
    },
    chunjo: {
        habilidad: 7
    },
    jinno: {
        media: 7
    }
}