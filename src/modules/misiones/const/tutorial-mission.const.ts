import { IdItem, IdMissionsList } from 'netim2-shared';
import type { CatalogMission } from '../types/mission-api.types';

export const TUTORIAL_MISSIONS: readonly CatalogMission[] = [
    {
        id: IdMissionsList.CONOCETE_A_TI_MISMO,
        name: "Conócete a ti mismo",
        description: "Has ganado experiencia, recluta, y con ella llegan los puntos que podrás invertir en tus propias estadísticas. Escoge bien dónde los colocas: cada punto puede marcar la diferencia entre la victoria y la derrota. Recuerda que no todas las razas ni todas las especialidades brillan en lo mismo; un guerrero puede necesitar más fuerza o resistencia, mientras que un mago sabrá sacarle provecho a la inteligencia o la agilidad. Piensa en tu camino, en quién quieres llegar a ser, y gasta esos puntos con sabiduría. Un buen soldado no solo entrena su cuerpo… también aprende a conocerse a sí mismo",
        category: "tutorial",
        owner: "capitan",
        shortDescription: "Sube 1 punto a uno de tus atributos",
        note: "En la ventana de General del Perfil, estara la sección Atributos, donde podras utilizar tus puntos para subir las estadisticas a tu personaje.",
        prerequisites: {minLevel: 1, claimedMissionIds: [IdMissionsList.UN_NUEVO_COMIENZO]},
        rewards: [{
            type: 'item',quantity:1,itemId:IdItem.ESPADA,upgradeLv:3
        }],
        steps: [{ id: 1, objectives: [
            { id: 1, type: "action", action: {event: "attribute_point_allocated"}, quantity: 10 },
        ] }],
    },
    {
        id: IdMissionsList.NACE_UN_ESPECIALISTA,
        name: "Nace un especialista",
        description: "Veo que ya no eres el mismo novato que llegó tambaleando a esta ciudad. Has alcanzado un nivel en el que debes tomar una decisión importante: elegir tu especialidad. A partir de ahora podrás aprender y utilizar habilidades que marcarán tu estilo de combate. Escoge con cuidado, porque esta elección guiará tu camino como guerrero. No es lo mismo blandir una espada con fuerza bruta que canalizar la magia con precisión… cada senda tiene sus ventajas y sacrificios. Piénsalo bien, discípulo, porque de aquí en adelante empezarás a forjar la verdadera leyenda de tu nombre.",
        category: "tutorial",
        owner: "capitan",
        shortDescription: "Elegí una especialidad.",
        note: "En la ventana de Habilidades podrás seleccionar una especialidad para obtener tus habilidades.",
        prerequisites: {minLevel: 3},
        rewards: [],
        steps: [{ id: 1, objectives: [
            { id: 1, type: "action", action: {event: "speciality_selected"}, quantity: 1 },
        ] }],
    },
];
