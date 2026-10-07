import { IdMob } from "src/modules/mob/types/id-mob-list.enum";
import { IdMissionsList } from "../types/idMissions/id-mission-list.enum";
import { Missions } from "../types/mission-base.type";
import { IdItem } from "netim2-shared";

export const SECUNDARY_MISSION: Missions[] = [
    {
    name: "Ingrediente para Medicina",
    idMission: IdMissionsList.INGREDIENTE_PARA_MEDICINA,
    description: "Desde que las Rocas Netim cayeron, una plaga se ha extendido por los pueblos cercanos. Nuestros médicos trabajan sin descanso para hallar una cura, pero se enfrentan a un problema crítico: nos falta un ingrediente esencial.Fuera de la aldea los animales se han vuelto salvajes y no podemos movernos con libertad. Necesitamos a alguien valiente que pueda atravesar esos territorios y traer lo que necesitamos.Tu objetivo es claro: consigue Bilis de oso. Son criaturas fuertes y esquivas, pero su órgano es vital para la medicina que podría salvar muchas vidas.Vuelve con él intacto y rápido. Cada minuto cuenta; mientras más tardes, más se propaga la enfermedad. Haz esto, aventurero… y podrás mirar a los aldeanos a los ojos sabiendo que ayudaste a salvarlos.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [],
        lvReq: 9
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.BILIS_DE_OSO, quantity: 1 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},

{
    name: "El Pin Perdido",
    idMission: IdMissionsList.EL_PIN_PERDIDO,
    description: "Escucha, aventurero… no es el fin del mundo, pero para alguien como este comerciante, esto es serio. Estuvo fuera un momento y alguien le ha robado un pin muy especial, un regalo de su padre. Y parece que podrían faltar otras cosas también.Los rumores apuntan a un herrero que alguna vez mencionó que le gustaba el pin… ¿coincidencia? Puede ser, pero no podemos ignorarlo.Necesito que vayas, revises su taller, encuentres el pin y cualquier otra cosa que haya sido tomada. Si descubres pruebas de quién lo tomó, tráelas también.No es una misión de vida o muerte, pero para él… es todo su mundo. Hazlo rápido y limpio, y te ganarás su gratitud… y quizás un pequeño obsequio extra.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [],
        lvReq: 28
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.HORQUILLA_ORNAMENTAL, quantity: 1 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},

{
    name: "La Caída de Eun-Jung",
    idMission: IdMissionsList.LA_CAIDA_DE_EUN_JUNG,
    description: "Eun-Jung representa la punta de lanza del Eid Blanco: no es una simple comandanta, es la chispa que mantiene unido a su ejército. Si cae, su gente perderá el rumbo.El resto de sus tropas pueden ser derrotadas con tiempo y orden; ella no. Eun-Jung tiene mente fría, mano rápida y seguidores que morirían por ella. No será un encuentro limpio ni breve.Tu orden es clara: entra en su campamento, encuentra a Eun-Jung y mátala. No la tomes prisionera. Trae pruebas de su muerte —su estandarte o su sello— para que nadie pueda decir que fue una invención.Hazlo con decisión. Si ella cae, el Eid Blanco quedará tambaleando y nosotros podremos aplastar al resto más fácilmente. El destino de la región está en tus manos. Ve y termina lo que empezamos.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [],
        lvReq: 25
    },
    missionProgress: {
        isDone: false,
        huntsProgress: [
            { idMob: IdMob.EUN_JUNG, quantity: 1 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "hunt",
},

{
    name: "Prueba del Jinete I: El Señor Mono",
    idMission: IdMissionsList.PRUEBA_DEL_JINETE_I_EL_SENOR_MONO,
    description: "Has crecido mucho desde que te vi por primera vez. Ahora llegas al cruce donde un guerrero se convierte en caballero: no bastan deseos ni buenas intenciones; se exige temple, puntería y corazón.La prueba que te propongo es simple en enunciado y brutal en ejecución: derrota al Señor Mono. Es una criatura astuta y veloz, conocida por sus brincos impredecibles, su uso de trampas y su desprecio por las reglas del combate honorable. No todos los que lo enfrentan vuelven.Si lo vences y traes pruebas de tu victoria, te será concedido el derecho de montar un corcel: a partir de entonces podrás usar caballo en tus viajes y en combate montado, un honor que eleva a cualquier soldado.No busques atajos ni trampas sucias. Esta no es una cacería por botín: es una prueba de nobleza. Demuestra que mereces el emblema del jinete y regresa con la talla del Señor Mono o su estandarte desgarrado.Ve con valor. Si triunfas, tu camino habrá cambiado para siempre.",
    shortDescription: "",
    mainMission: false,
    note: "Al completar esta mision podras usar un caballo como montura",
    missionReq: {
        idMissionDone: [
            IdMissionsList.PREPARATIVOS_DE_UN_CABALLERO
        ],
        lvReq: 25
    },
    missionProgress: {
        isDone: false,
        huntsProgress: [
            { idMob: IdMob.SENOR_MONO, quantity: 1 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "hunt",
},

{
    name: "Mi-Jung de los Eids Blancos",
    idMission: IdMissionsList.MI_JUNG_DE_LOS_EIDS_BLANCOS,
    description: "¿Te atreves a perseguir a Mi-Jung? Buena. Ella y sus cortesanos del Eid Blanco nos han hecho pagar cada patrulla. Nos cuesta proteger la aldea cuando una de sus líderes siembra terror como una sombra que nunca se apaga.Mi-Jung no es una soldado común: se mueve rápido, conoce los atajos y utiliza emboscadas para dividir y quebrar a sus enemigos. Si la dejamos libre, seguirá golpeando a los inocentes y desmoralizando a nuestras tropas.Quiero que la encuentres y la elimines. No es necesario tomarla viva. Trae pruebas de su caída —su estandarte rasgado o el broche con su emblema— para que nadie diga que fue una fábula.Ten cuidado con civiles y con las emboscadas: ella prefiere el caos al enfrentamiento honorable. Haz esto con decisión. Si Mi-Jung cae, respiraremos un poco más tranquilos. Ve y acaba con esa sombra.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [],
        lvReq: 23
    },
    missionProgress: {
        isDone: false,
        huntsProgress: [
            { idMob: IdMob.MI_JUNG, quantity: 1 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "hunt",
},

{
    name: "Preparativos de un Caballero",
    idMission: IdMissionsList.PREPARATIVOS_DE_UN_CABALLERO,
    description: "Antes de que te den una prueba a tu medida para poder montar, hay un viejo anciano en las afueras de la ciudad, capaz ya te lo cruzaste. Este viejo sabio sabe como abrir ciertas compuertas para entrar en lugares muy peligrosos, y creo que ese será la prueba definitoria para saber que sos digno de un corcel. El clan de los Eil Blancos esta muy debilitado , en gran medida gracias a vos, pero siguen queriendo recuperarse y volver a ser lo que alguna vez fueron a toda costa, este anciano esta teniendo muchos problemas con ellos, despeja la zona y te dare la llave para que puedas realizar la prueba final. ",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [],
        lvReq: 25
    },
    missionProgress: {
        isDone: false,
        huntsProgress: [
            { idMob: IdMob.COMANDANTE_BLANCO_DE_EID, quantity: 4 },
            { idMob: IdMob.ARQUERO_BLANCO_DEL_EID, quantity: 4 },
            { idMob: IdMob.SOLDADO_BLANCO_DE_EIL, quantity: 4 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "hunt",
},

{
    name: "Un Atuendo Legendario I",
    idMission: IdMissionsList.UN_ATUENDO_LEGENDARIO_I,
    description: "El orfebre de la ciudad está trabajando en algo… diferente. Dice que ha encontrado una manera de canalizar la energía de las piedras Netim sin sucumbir a su corrupción. No sé si creerle del todo, pero si tiene razón, esto podría cambiarlo todo.Para fabricar el atuendo que servirá como conducto, necesita materiales que no se encuentran en cualquier mercado. Su primera petición es simple, aunque peligrosa: piel de lobo.No cualquier piel servirá: debe ser de lobos que hayan estado expuestos a la energía de los Netim. Al parecer, esa influencia deja una textura especial en el pelaje… una especie de resistencia natural a la magia oscura.Ve, caza a esos lobos y tráele las pieles al orfebre. Él se encargará del resto. Si logra dominar ese poder, podríamos tener una oportunidad real contra lo que sea que esté detrás de las piedras Netim.",
    shortDescription: "",
    mainMission: false,
    note: "En el orfebre podes añadir piedras a las armaduras y armas. Estas piedras se consiguen al destruir Netims y se pueden mejorar en el Herrero.",
    missionReq: {
        idMissionDone: [],
        lvReq: 3
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.PIEL_DE_LOBO, quantity: 1 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},

{
    name: "Un Atuendo Legendario II",
    idMission: IdMissionsList.UN_ATUENDO_LEGENDARIO_II,
    description: "El orfebre sigue adelante con su ambicioso proyecto: un atuendo capaz de canalizar la energía de las piedras Netim sin ser consumido por ella. Su taller huele a metal, incienso y obsesión… pero no puedo negar que sus progresos son notables.Para la siguiente fase de su trabajo necesita algo más resistente. Dice que las corrientes mágicas que fluyen a través del tejido desgarran los materiales comunes, y solo un tipo de piel puede soportarlas: la Piel de Pie de Oso.Estos osos no son criaturas ordinarias. Son fuertes, lentos, pero casi imposibles de derribar, y su piel posee una densidad fuera de lo común. El orfebre asegura que ese material servirá como base para reforzar las costuras del atuendo, permitiendo que contenga el poder Netim sin que el portador se queme por dentro.Ve, derriba a esas bestias y tráele las pieles. Si logra terminar esta fase, su creación estará un paso más cerca de convertirse en una obra legendaria.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [
            IdMissionsList.UN_ATUENDO_LEGENDARIO_I
        ],
        lvReq: 11
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.PIEL_DE_PIE_DE_OSO, quantity: 2 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},

{
    name: "Un Atuendo Legendario III",
    idMission: IdMissionsList.UN_ATUENDO_LEGENDARIO_III,
    description: "El orfebre continúa su trabajo en la creación de un atuendo único, capaz de canalizar el poder oculto de las piedras Netim.Para avanzar en esta etapa, necesita materiales más resistentes y con una energía salvaje.Te ha encomendado la tarea de conseguir Piel de Tigre, un recurso raro y peligroso de obtener.Los tigres que poseen estas pieles habitan en zonas profundas de la selva, y enfrentarlos requerirá toda tu preparación y valentía.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [
            IdMissionsList.UN_ATUENDO_LEGENDARIO_II
        ],
        lvReq: 18
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.PIEL_DE_TIGRE, quantity: 2 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},

{
    name: "Un Atuendo Legendario IV: Final",
    idMission: IdMissionsList.UN_ATUENDO_LEGENDARIO_IV_FINAL,
    description: "El orfebre está a punto de culminar su obra maestra: un atuendo único, capaz de canalizar el poder completo de las piedras Netim.Solo le falta un material legendario, símbolo de pureza y dominio espiritual: la Piel de Tigre Blanco.Obtenerla no será tarea fácil.Se dice que los tigres blancos habitan en los lugares más fríos y sagrados del continente, y que cada uno es guardián de un poder ancestral.Derrotar a uno significará enfrentarse a la fuerza misma de la naturaleza.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [
            IdMissionsList.UN_ATUENDO_LEGENDARIO_III
        ],
        lvReq: 24
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.PIEL_DE_TIGRE_BLANCO, quantity: 2 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},

{
    name: "Conoce a tu Enemigo",
    idMission: IdMissionsList.CONOCE_A_TU_ENEMIGO,
    description: "Guerrero, el Encantador ha tenido una idea... arriesgada, pero podría cambiar el rumbo de esta guerra. Según él, la energía que emanan las piedras Netim no solo destruye: también transforma. Si logramos comprender cómo se libera y se comporta, tal vez podamos aprovecharla para mejorar nuestro equipamiento.El Encantador cree que puede purificar y canalizar parte de ese poder oscuro, reforzando las armas y armaduras de nuestras tropas sin que sus portadores sean corrompidos… o al menos, no del todo. No te voy a mentir: es peligroso. Pero si funciona, podríamos tener una ventaja decisiva.Tu misión es destruir unos Netim. Queremos observar cómo libera su energía, cómo reacciona el entorno, y qué rastro deja tras su colapso. Cada detalle cuenta.Lleva cuidado, soldado. Nadie sabe con certeza qué ocurre cuando una de esas piedras se rompe del todo. Pero si sobrevives… el Encantador tendrá lo que necesita para comenzar sus experimentos, y quizás demos el primer paso hacia un poder que hasta ahora solo los Netims comprenden.",
    shortDescription: "",
    mainMission: false,
    note: "En el encantador, con ciertos materiales, puedes agregar y cambiar bonus a tu equipo, para hacerlo más poderoso.",
    missionReq: {
        idMissionDone: [],
        lvReq: 5
    },
    missionProgress: {
        isDone: false,
        huntsProgress: [
            { idMob: IdMob.NETIM_DE_DOLOR, quantity: 2 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "hunt",
},

{
    name: "Suministros Perdidos",
    idMission: IdMissionsList.SUMINISTROS_PERDIDOS,
    description: "Tenemos un problema urgente: el puesto de vigilancia nos ha informado que han robado la comida. Sin provisiones, nuestros soldados no podrán mantenerse fuertes y alertas.Para remediarlo, necesitamos algo poco común pero extremadamente nutritivo: hígados de tigre. Sí, suena salvaje, pero cada uno contiene la energía que nuestros hombres necesitan para mantenerse en pie durante las patrullas y combates.Tu misión es clara: adéntrate en el territorio de los tigres, caza los suficientes para abastecer a nuestras tropas y regresa con ellos intactos. No subestimes a las bestias: son rápidas, fuertes y territoriales.Cada hígado que traigas mantiene a un soldado vivo y fuerte. Cada minuto que tardes es comida que no llega. Ve con decisión y precisión, aventurero.",
    shortDescription: "",
    mainMission: false,
    note: "",
    missionReq: {
        idMissionDone: [],
        lvReq: 17
    },
    missionProgress: {
        isDone: false,
        collectProgress: [
            { idItem: IdItem.HIGADO_DE_TIGRE, quantity: 2 },
        ]
    },
    missionReward: {
        exp: 0,
        yang: 0,
        itemsConfig: [],
        items: []
    },
    type: "collect",
},
]