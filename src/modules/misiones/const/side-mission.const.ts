import { IdItem, IdMob, IdMissionsList } from 'netim2-shared';
import type { CatalogMission } from '../types/mission-api.types';

export const SIDE_MISSIONS: readonly CatalogMission[] = [
    {
        id: IdMissionsList.INGREDIENTE_PARA_MEDICINA,
        name: "Ingrediente para Medicina",
        description: "Desde que las Rocas Netim cayeron, una plaga se ha extendido por los pueblos cercanos. Nuestros médicos trabajan sin descanso para hallar una cura, pero se enfrentan a un problema crítico: nos falta un ingrediente esencial.Fuera de la aldea los animales se han vuelto salvajes y no podemos movernos con libertad. Necesitamos a alguien valiente que pueda atravesar esos territorios y traer lo que necesitamos.Tu objetivo es claro: consigue Bilis de oso. Son criaturas fuertes y esquivas, pero su órgano es vital para la medicina que podría salvar muchas vidas.Vuelve con él intacto y rápido. Cada minuto cuenta; mientras más tardes, más se propaga la enfermedad. Haz esto, aventurero… y podrás mirar a los aldeanos a los ojos sabiendo que ayudaste a salvarlos.",
        category: "side",
        owner: "tienda_general",
        prerequisites: { minLevel: 9 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.BILIS_DE_OSO, quantity: 1, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.EL_PIN_PERDIDO,
        name: "El Pin Perdido",
        description: "Escucha, aventurero… no es el fin del mundo, pero para alguien como este comerciante, esto es serio. Estuvo fuera un momento y alguien le ha robado un pin muy especial, un regalo de su padre. Y parece que podrían faltar otras cosas también.Los rumores apuntan a un herrero que alguna vez mencionó que le gustaba el pin… ¿coincidencia? Puede ser, pero no podemos ignorarlo.Necesito que vayas, revises su taller, encuentres el pin y cualquier otra cosa que haya sido tomada. Si descubres pruebas de quién lo tomó, tráelas también.No es una misión de vida o muerte, pero para él… es todo su mundo. Hazlo rápido y limpio, y te ganarás su gratitud… y quizás un pequeño obsequio extra.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 28 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.HORQUILLA_ORNAMENTAL, quantity: 1, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.LA_CAIDA_DE_EUN_JUNG,
        name: "La Caída de Eun-Jung",
        description: "Eun-Jung representa la punta de lanza del Eid Blanco: no es una simple comandanta, es la chispa que mantiene unido a su ejército. Si cae, su gente perderá el rumbo.El resto de sus tropas pueden ser derrotadas con tiempo y orden; ella no. Eun-Jung tiene mente fría, mano rápida y seguidores que morirían por ella. No será un encuentro limpio ni breve.Tu orden es clara: entra en su campamento, encuentra a Eun-Jung y mátala. No la tomes prisionera. Trae pruebas de su muerte —su estandarte o su sello— para que nadie pueda decir que fue una invención.Hazlo con decisión. Si ella cae, el Eid Blanco quedará tambaleando y nosotros podremos aplastar al resto más fácilmente. El destino de la región está en tus manos. Ve y termina lo que empezamos.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 25 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.EUN_JUNG] }, quantity: 1 },
            ]
        }],
    },
    {
        id: IdMissionsList.PRUEBA_DEL_JINETE_I_EL_SENOR_MONO,
        name: "Prueba del Jinete I: El Señor Mono",
        description: "Has crecido mucho desde que te vi por primera vez. Ahora llegas al cruce donde un guerrero se convierte en caballero: no bastan deseos ni buenas intenciones; se exige temple, puntería y corazón.La prueba que te propongo es simple en enunciado y brutal en ejecución: derrota al Señor Mono. Es una criatura astuta y veloz, conocida por sus brincos impredecibles, su uso de trampas y su desprecio por las reglas del combate honorable. No todos los que lo enfrentan vuelven.Si lo vences y traes pruebas de tu victoria, te será concedido el derecho de montar un corcel: a partir de entonces podrás usar caballo en tus viajes y en combate montado, un honor que eleva a cualquier soldado.No busques atajos ni trampas sucias. Esta no es una cacería por botín: es una prueba de nobleza. Demuestra que mereces el emblema del jinete y regresa con la talla del Señor Mono o su estandarte desgarrado.Ve con valor. Si triunfas, tu camino habrá cambiado para siempre.",
        category: "side",
        owner: "capitan",
        note: "Al completar esta mision podras usar un caballo como montura",
        prerequisites: { minLevel: 25, claimedMissionIds: [IdMissionsList.PREPARATIVOS_DE_UN_CABALLERO] },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.SENOR_MONO] }, quantity: 1 },
            ]
        }],
    },
    {
        id: IdMissionsList.MI_JUNG_DE_LOS_EIDS_BLANCOS,
        name: "Mi-Jung de los Eids Blancos",
        description: "¿Te atreves a perseguir a Mi-Jung? Buena. Ella y sus cortesanos del Eid Blanco nos han hecho pagar cada patrulla. Nos cuesta proteger la aldea cuando una de sus líderes siembra terror como una sombra que nunca se apaga.Mi-Jung no es una soldado común: se mueve rápido, conoce los atajos y utiliza emboscadas para dividir y quebrar a sus enemigos. Si la dejamos libre, seguirá golpeando a los inocentes y desmoralizando a nuestras tropas.Quiero que la encuentres y la elimines. No es necesario tomarla viva. Trae pruebas de su caída —su estandarte rasgado o el broche con su emblema— para que nadie diga que fue una fábula.Ten cuidado con civiles y con las emboscadas: ella prefiere el caos al enfrentamiento honorable. Haz esto con decisión. Si Mi-Jung cae, respiraremos un poco más tranquilos. Ve y acaba con esa sombra.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 23 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.MI_JUNG] }, quantity: 1 },
            ]
        }],
    },
    {
        id: IdMissionsList.PREPARATIVOS_DE_UN_CABALLERO,
        name: "Preparativos de un Caballero",
        description: "Antes de que te den una prueba a tu medida para poder montar, hay un viejo anciano en las afueras de la ciudad, capaz ya te lo cruzaste. Este viejo sabio sabe como abrir ciertas compuertas para entrar en lugares muy peligrosos, y creo que ese será la prueba definitoria para saber que sos digno de un corcel. El clan de los Eil Blancos esta muy debilitado , en gran medida gracias a vos, pero siguen queriendo recuperarse y volver a ser lo que alguna vez fueron a toda costa, este anciano esta teniendo muchos problemas con ellos, despeja la zona y te dare la llave para que puedas realizar la prueba final. ",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 25 },
        rewards: [
            {
                type: 'item', itemId: IdItem.ESPADA, upgradeLv: 2, quantity: 1
            },
            {
                type: 'exp', amount: 10000
            },
            {
                type: 'yang', amount: 10000
            }
        ],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.COMANDANTE_BLANCO_DE_EID] }, quantity: 4 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ARQUERO_BLANCO_DEL_EID] }, quantity: 4 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.SOLDADO_BLANCO_DE_EIL] }, quantity: 4 },
            ]
        }],
    },
    {
        id: IdMissionsList.UN_ATUENDO_LEGENDARIO_I,
        name: "Un Atuendo Legendario I",
        description: "El orfebre de la ciudad está trabajando en algo… diferente. Dice que ha encontrado una manera de canalizar la energía de las piedras Netim sin sucumbir a su corrupción. No sé si creerle del todo, pero si tiene razón, esto podría cambiarlo todo.Para fabricar el atuendo que servirá como conducto, necesita materiales que no se encuentran en cualquier mercado. Su primera petición es simple, aunque peligrosa: piel de lobo.No cualquier piel servirá: debe ser de lobos que hayan estado expuestos a la energía de los Netim. Al parecer, esa influencia deja una textura especial en el pelaje… una especie de resistencia natural a la magia oscura.Ve, caza a esos lobos y tráele las pieles al orfebre. Él se encargará del resto. Si logra dominar ese poder, podríamos tener una oportunidad real contra lo que sea que esté detrás de las piedras Netim.",
        category: "side",
        owner: "tienda_armaduras",
        note: "En el orfebre podes añadir piedras a las armaduras y armas. Estas piedras se consiguen al destruir Netims y se pueden mejorar en el Herrero.",
        prerequisites: { minLevel: 3 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.PIEL_DE_LOBO, quantity: 1, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.UN_ATUENDO_LEGENDARIO_II,
        name: "Un Atuendo Legendario II",
        description: "El orfebre sigue adelante con su ambicioso proyecto: un atuendo capaz de canalizar la energía de las piedras Netim sin ser consumido por ella. Su taller huele a metal, incienso y obsesión… pero no puedo negar que sus progresos son notables.Para la siguiente fase de su trabajo necesita algo más resistente. Dice que las corrientes mágicas que fluyen a través del tejido desgarran los materiales comunes, y solo un tipo de piel puede soportarlas: la Piel de Pie de Oso.Estos osos no son criaturas ordinarias. Son fuertes, lentos, pero casi imposibles de derribar, y su piel posee una densidad fuera de lo común. El orfebre asegura que ese material servirá como base para reforzar las costuras del atuendo, permitiendo que contenga el poder Netim sin que el portador se queme por dentro.Ve, derriba a esas bestias y tráele las pieles. Si logra terminar esta fase, su creación estará un paso más cerca de convertirse en una obra legendaria.",
        category: "side",
        owner: "tienda_armaduras",
        prerequisites: { minLevel: 11, claimedMissionIds: [IdMissionsList.UN_ATUENDO_LEGENDARIO_I] },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.PIEL_DE_PIE_DE_OSO, quantity: 2, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.UN_ATUENDO_LEGENDARIO_III,
        name: "Un Atuendo Legendario III",
        description: "El orfebre continúa su trabajo en la creación de un atuendo único, capaz de canalizar el poder oculto de las piedras Netim.Para avanzar en esta etapa, necesita materiales más resistentes y con una energía salvaje.Te ha encomendado la tarea de conseguir Piel de Tigre, un recurso raro y peligroso de obtener.Los tigres que poseen estas pieles habitan en zonas profundas de la selva, y enfrentarlos requerirá toda tu preparación y valentía.",
        category: "side",
        owner: "tienda_armaduras",
        prerequisites: { minLevel: 18, claimedMissionIds: [IdMissionsList.UN_ATUENDO_LEGENDARIO_II] },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.PIEL_DE_TIGRE, quantity: 2, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.UN_ATUENDO_LEGENDARIO_IV_FINAL,
        name: "Un Atuendo Legendario IV: Final",
        description: "El orfebre está a punto de culminar su obra maestra: un atuendo único, capaz de canalizar el poder completo de las piedras Netim.Solo le falta un material legendario, símbolo de pureza y dominio espiritual: la Piel de Tigre Blanco.Obtenerla no será tarea fácil.Se dice que los tigres blancos habitan en los lugares más fríos y sagrados del continente, y que cada uno es guardián de un poder ancestral.Derrotar a uno significará enfrentarse a la fuerza misma de la naturaleza.",
        category: "side",
        owner: "tienda_armaduras",
        prerequisites: { minLevel: 24, claimedMissionIds: [IdMissionsList.UN_ATUENDO_LEGENDARIO_III] },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.PIEL_DE_TIGRE_BLANCO, quantity: 2, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.CONOCE_A_TU_ENEMIGO,
        name: "Conoce a tu Enemigo",
        description: "Guerrero, el Encantador ha tenido una idea... arriesgada, pero podría cambiar el rumbo de esta guerra. Según él, la energía que emanan las piedras Netim no solo destruye: también transforma. Si logramos comprender cómo se libera y se comporta, tal vez podamos aprovecharla para mejorar nuestro equipamiento.El Encantador cree que puede purificar y canalizar parte de ese poder oscuro, reforzando las armas y armaduras de nuestras tropas sin que sus portadores sean corrompidos… o al menos, no del todo. No te voy a mentir: es peligroso. Pero si funciona, podríamos tener una ventaja decisiva.Tu misión es destruir unos Netim. Queremos observar cómo libera su energía, cómo reacciona el entorno, y qué rastro deja tras su colapso. Cada detalle cuenta.Lleva cuidado, soldado. Nadie sabe con certeza qué ocurre cuando una de esas piedras se rompe del todo. Pero si sobrevives… el Encantador tendrá lo que necesita para comenzar sus experimentos, y quizás demos el primer paso hacia un poder que hasta ahora solo los Netims comprenden.",
        category: "side",
        owner: "capitan",
        note: "En el encantador, con ciertos materiales, puedes agregar y cambiar bonus a tu equipo, para hacerlo más poderoso.",
        prerequisites: { minLevel: 5 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.NETIM_DE_DOLOR] }, quantity: 2 },
            ]
        }],
    },
    {
        id: IdMissionsList.SUMINISTROS_PERDIDOS,
        name: "Suministros Perdidos",
        description: "Tenemos un problema urgente: el puesto de vigilancia nos ha informado que han robado la comida. Sin provisiones, nuestros soldados no podrán mantenerse fuertes y alertas.Para remediarlo, necesitamos algo poco común pero extremadamente nutritivo: hígados de tigre. Sí, suena salvaje, pero cada uno contiene la energía que nuestros hombres necesitan para mantenerse en pie durante las patrullas y combates.Tu misión es clara: adéntrate en el territorio de los tigres, caza los suficientes para abastecer a nuestras tropas y regresa con ellos intactos. No subestimes a las bestias: son rápidas, fuertes y territoriales.Cada hígado que traigas mantiene a un soldado vivo y fuerte. Cada minuto que tardes es comida que no llega. Ve con decisión y precisión, aventurero.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 17 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "collect", itemId: IdItem.HIGADO_DE_TIGRE, quantity: 2, mode: "inventory", consumeOnClaim: true },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_1,
        name: "Misión de Caza 1",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 2 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.PERRO_SALVAJE] }, quantity: 3 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_2,
        name: "Misión de Caza 2",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 4 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.LOBO_ALFA] }, quantity: 4 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_3,
        name: "Misión de Caza 3",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 6 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.JABALI] }, quantity: 3 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_4,
        name: "Misión de Caza 4",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 8 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.JABALI] }, quantity: 3 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.OSO] }, quantity: 2 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_5,
        name: "Misión de Caza 5",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 10 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.JABALI] }, quantity: 4 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_6,
        name: "Misión de Caza 6",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 12 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.OSO] }, quantity: 6 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_7,
        name: "Misión de Caza 7",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 14 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.MU_RANG] }, quantity: 3 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.OSO] }, quantity: 4 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_8,
        name: "Misión de Caza 8",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 16 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.LOBO_ALFA_GRIS_MALDITO] }, quantity: 7 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_9,
        name: "Misión de Caza 9",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 18 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.TIGRE] }, quantity: 8 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_10,
        name: "Misión de Caza 10",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 20 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.SOLDADO_BLANCO_DE_EIL] }, quantity: 6 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ARQUERO_BLANCO_DEL_EID] }, quantity: 6 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_11,
        name: "Misión de Caza 11",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 22 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.SOLDADO_BLANCO_DE_EIL] }, quantity: 5 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ARQUERO_BLANCO_DEL_EID] }, quantity: 5 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.COMANDANTE_BLANCO_DE_EID] }, quantity: 3 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_12,
        name: "Misión de Caza 12",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 24 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.COMANDANTE_BLANCO_DE_EID] }, quantity: 11 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_13,
        name: "Misión de Caza 13",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 26 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.TIGRE_BLANCO_MALDITO] }, quantity: 8 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.EUN_JUNG] }, quantity: 5 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_14,
        name: "Misión de Caza 14",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 28 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.EUN_JUNG] }, quantity: 9 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.SE_RANG] }, quantity: 9 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_15,
        name: "Misión de Caza 15",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 30 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.SOLDADO_DE_INFANTERIA_SALVAJE] }, quantity: 17 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_16,
        name: "Misión de Caza 16",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 32 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.ARQUERO_DEL_HURACAN_OSCURO] }, quantity: 12 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.EXPLORADOR_ORCO] }, quantity: 8 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_17,
        name: "Misión de Caza 17",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 34 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.SECUAZ_SALVAJE] }, quantity: 7 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ORCO_MAGO] }, quantity: 7 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.ARANA_VENENOSA_VIL] }, quantity: 7 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_18,
        name: "Misión de Caza 18",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 36 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.JOH_HWAN] }, quantity: 8 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ORCO_GRANDE_OSADO] }, quantity: 8 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.REY_ESCORPION] }, quantity: 8 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_19,
        name: "Misión de Caza 19",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 38 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.KYUK_JANG] }, quantity: 10 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.LUCHADOR_ORCO_ELITE] }, quantity: 9 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.REY_ESCORPION] }, quantity: 10 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_20,
        name: "Misión de Caza 20",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 40 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.FANATICO_OSCURO] }, quantity: 8 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ARAHAN_OSCURO] }, quantity: 8 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.ESPECIALISTA_BESTIAL] }, quantity: 10 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_21,
        name: "Misión de Caza 21",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 42 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.GRAN_ARAHAN_ELITE] }, quantity: 14 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.MAHON] }, quantity: 13 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_22,
        name: "Misión de Caza 22",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 44 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.TORTURADOR_OSCURO] }, quantity: 13 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.CHOUNG] }, quantity: 13 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_23,
        name: "Misión de Caza 23",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 46 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.ARQUERO_ESCORPION] }, quantity: 12 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ORCO_NEGRO] }, quantity: 13 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_24,
        name: "Misión de Caza 24",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 48 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.HOMBRE_ESCORPION] }, quantity: 15 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.GIGANTE_ORCO_NEGRO] }, quantity: 12 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_25,
        name: "Misión de Caza 25",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 50 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.ARANA_GARRA_VENENOSA] }, quantity: 10 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.BANDIDO_DEL_DESIERTO] }, quantity: 9 },
                { id: 3, type: "hunt", target: { mobIds: [IdMob.GENERAL_ORCO_GRANDE_OSADO] }, quantity: 11 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_26,
        name: "Misión de Caza 26",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 52 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.SERPIENTE_ESPADACHIN] }, quantity: 13 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.SERPIENTE_ARQUERA] }, quantity: 13 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_27,
        name: "Misión de Caza 27",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 54 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.HIELO_ENCANTADO_MEZQUINO] }, quantity: 20 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_28,
        name: "Misión de Caza 28",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 56 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.HOMBRE_PLAGA_FURIOSO] }, quantity: 14 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.SOLDADO_RANA_ARBOREA] }, quantity: 14 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_29,
        name: "Misión de Caza 29",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 58 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.BICHO_DE_HIELO] }, quantity: 18 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_30,
        name: "Misión de Caza 30",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 60 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.HOMBRE_DEL_SACO] }, quantity: 15 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_31,
        name: "Misión de Caza 31",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 62 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.GENERAL_RANA_TORO] }, quantity: 15 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.LANCERO_PLAGA] }, quantity: 10 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_32,
        name: "Misión de Caza 32",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 64 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.ARQUERO_PLAGA] }, quantity: 13 },
                { id: 2, type: "hunt", target: { mobIds: [IdMob.ESPADACHIN_PLAGA] }, quantity: 10 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_33,
        name: "Misión de Caza 33",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 66 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.LIDER_PLAGA] }, quantity: 18 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_34,
        name: "Misión de Caza 34",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 68 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.HOMBRE_DE_HIELO] }, quantity: 17 },
            ]
        }],
    },
    {
        id: IdMissionsList.MISION_DE_CAZA_35,
        name: "Misión de Caza 35",
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        category: "side",
        owner: "capitan",
        prerequisites: { minLevel: 70 },
        rewards: [],
        steps: [{
            id: 1, objectives: [
                { id: 1, type: "hunt", target: { mobIds: [IdMob.GOLEM_DE_HIELO] }, quantity: 17 },
            ]
        }],
    },
];
