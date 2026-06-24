import { IdMob } from "src/modules/mob/types/id-mob-list.enum";
import { IdMissionsList } from "../types/idMissions/id-mission-list.enum";
import { Missions } from "../types/mission-base.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const MAIN_MISSION: Missions[] = [
    {
        name: "Un nuevo comienzo",
        idMission: IdMissionsList.UN_NUEVO_COMIENZO,
        description: "Escucha bien, recluta. No llevas mucho tiempo en esta ciudad, pero ya habrás notado que algo anda mal en estas tierras. Los Netims han comenzado a surgir de la nada, como gotas de agua que caen del cielo, y su presencia corrompe todo lo que toca. No solo quiebran la calma de la tierra… también trastornan a las criaturas que habitan en ella. Los perros salvajes, que antes vagaban sin ser más que una molestia menor, ahora se han vuelto agresivos, rabiosos y hambrientos de sangre. Antes de confiarte tareas mayores, quiero que salgas de las murallas y te enfrentes a ellos. Ve, limpia los alrededores de estas bestias y vuelve con prueba de tu cacería. Considera esto tu bautismo, muchacho… si no puedes con unos perros trastornados, jamás estarás listo para encarar lo que los Netims han traído consigo.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 1
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.PERRO_SALVAJE, quantity: 3 },
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
        name: "Conócete a ti mismo",
        idMission: IdMissionsList.CONOCETE_A_TI_MISMO,
        description: "Has ganado experiencia, recluta, y con ella llegan los puntos que podrás invertir en tus propias estadísticas. Escoge bien dónde los colocas: cada punto puede marcar la diferencia entre la victoria y la derrota. Recuerda que no todas las razas ni todas las especialidades brillan en lo mismo; un guerrero puede necesitar más fuerza o resistencia, mientras que un mago sabrá sacarle provecho a la inteligencia o la agilidad. Piensa en tu camino, en quién quieres llegar a ser, y gasta esos puntos con sabiduría. Un buen soldado no solo entrena su cuerpo… también aprende a conocerse a sí mismo",
        shortDescription: "Sube 1 punto a uno de tus atributos",
        mainMission: true,
        note: "En la ventana de General del Perfil, estara la sección Atributos, donde podras utilizar tus puntos para subir las estadisticas a tu personaje.",
        missionReq: {
            idMissionDone: [
                IdMissionsList.UN_NUEVO_COMIENZO,
            ],
            lvReq: 1
        },
        missionProgress: {
            typeAction: "atributo",
            isDone: false
        },
        missionReward: {
            exp: 0,
            yang: 0,
            itemsConfig: [],
            items: []
        },
        type: "action",
    },

    {
        name: "Un favor del herrero",
        idMission: IdMissionsList.UN_FAVOR_DEL_HERRERO,
        description: "Bien, recluta. El herrero ha pedido ayuda, y cuando el herrero pide algo, más vale escuchar. Desde que los Netims empezaron a aparecer, el trabajo en la forja se ha vuelto más exigente. Las armas se quiebran más rápido, las armaduras no resisten como antes, y necesitamos mantener el equipo de la ciudad en buen estado.Según él, le faltan materiales básicos para seguir trabajando. Necesita Garras de Lobo. No son difíciles de conseguir, pero no te confíes: los lobos de la zona ya no son simples animales. La corrupción los ha vuelto más agresivos, y acercarte demasiado puede costarte caro.Consigue lo que te pide y llévaselo. A cambio, te enseñará lo básico sobre el sistema de mejora de equipo. Aprenderás cómo reforzar tus armas y armaduras para enfrentar enemigos cada vez más peligrosos.No lo veas como un simple mandado. Entender cómo mejorar tu equipo puede ser la diferencia entre volver con vida… o quedar tirado en el campo.",
        shortDescription: "",
        mainMission: true,
        note: "En el herrero puedes mejorar tus equipos y piedras, aumentando su poder.",
        missionReq: {
            idMissionDone: [
                IdMissionsList.CONOCETE_A_TI_MISMO,
            ],
            lvReq: 2
        },
        missionProgress: {
            isDone: false,
            collectProgress: [
                { idItem: IdItem.GARRA_DE_LOBO, quantity: 1 },
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
        name: "Nace un especialista",
        idMission: IdMissionsList.NACE_UN_ESPECIALISTA,
        description: "Veo que ya no eres el mismo novato que llegó tambaleando a esta ciudad. Has alcanzado un nivel en el que debes tomar una decisión importante: elegir tu especialidad. A partir de ahora podrás aprender y utilizar habilidades que marcarán tu estilo de combate. Escoge con cuidado, porque esta elección guiará tu camino como guerrero. No es lo mismo blandir una espada con fuerza bruta que canalizar la magia con precisión… cada senda tiene sus ventajas y sacrificios. Piénsalo bien, discípulo, porque de aquí en adelante empezarás a forjar la verdadera leyenda de tu nombre.",
        shortDescription: "Sube de nivel una habilidad.",
        mainMission: true,
        note: "En la ventana de Habilidades podrás seleccionar una especialidad para obtener tus habilidades.",
        missionReq: {
            idMissionDone: [],
            lvReq: 3
        },
        missionProgress: {
            typeAction: "especialidad",
            isDone: false
        },
        missionReward: {
            exp: 0,
            yang: 0,
            itemsConfig: [],
            items: []
        },
        type: "action",
    },

    {
        name: "Aromas de esperanza",
        idMission: IdMissionsList.AROMAS_DE_ESPERANZA,
        description: "La ciudad huele a sangre, sudor y miedo… necesitamos algo que recuerde a la gente que aún hay belleza en este mundo. El boticario me ha pedido ayuda para preparar ungüentos y tónicos calmantes para los heridos, pero también para levantar el ánimo de quienes han perdido a sus familias en los ataques.Para eso necesita un material simple, pero valioso: Diente de Jabalí. Al molerlo y mezclarlo con ciertas hierbas, puede preparar un ungüento fuerte que ayuda a cerrar heridas y reducir la fiebre.No será una tarea complicada, pero tampoco inútil. Cada diente que traigas puede convertirse en medicina, y cada medicina puede mantener con vida a alguien que aún quiere luchar.Ve a cazar jabalíes, consigue lo necesario y vuelve con el boticario. No todas las victorias se ganan con una espada en la mano; algunas empiezan con algo tan humilde como un remedio bien preparado.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.NACE_UN_ESPECIALISTA,
            ],
            lvReq: 4
        },
        missionProgress: {
            isDone: false,
            collectProgress: [
                { idItem: IdItem.FLOR_KAKI, quantity: 2 },
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
        name: "Otro favor más",
        idMission: IdMissionsList.OTRO_FAVOR_MAS,
        description: "El herrero vuelve a necesitar ayuda. No pongas esa cara; si quieres buen equipo, tendrás que ganarte su confianza. Esta vez está trabajando en refuerzos para las armas de los guardias, pero le falta un material resistente y flexible: Piel de Lobo. Con ella puede endurecer empuñaduras, reforzar correas y mejorar la estabilidad de ciertas piezas.No te confundas, no se trata solo de hacer armas más bonitas. En combate, una correa rota o una empuñadura mal ajustada pueden costarle la vida a un soldado. El herrero lo sabe, por eso está tan insistente.Sal a cazar lobos y consigue las pieles que necesita. Si haces esto, no solo ayudarás a la ciudad, también aprenderás una lección importante: hasta el equipo más poderoso depende de los detalles pequeños.Y créeme… cuando estés frente a un Netim, esos detalles importarán más de lo que piensas.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.AROMAS_DE_ESPERANZA,
            ],
            lvReq: 5
        },
        missionProgress: {
            isDone: false,
            collectProgress: [
                { idItem: IdItem.DIENTE_DE_JABALI, quantity: 1 },
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
        name: "Mision imposible",
        idMission: IdMissionsList.MISION_IMPOSIBLE,
        description: "Escucha con atención, recluta. Hasta ahora has cazado bestias menores, recogido materiales y hecho favores para la ciudad. Pero esta vez la tarea es distinta.Mu-Rang ha sido visto rondando los límites del bosque. No es una criatura común. Es fuerte, rápido y mucho más peligroso que cualquier bestia que hayas enfrentado hasta ahora. Algunos lo llaman una prueba imposible para alguien de tu rango… pero yo no suelo creer en imposibles.La corrupción de los Netim ha alterado su comportamiento, y si sigue merodeando cerca de los caminos, pronto atacará a viajeros, comerciantes o incluso a los guardias del puesto exterior.Tu misión es clara: encuentra a Mu-Rang y derrótalo.No te confíes. Prepárate bien, revisa tu equipo, mejora lo que puedas y lleva pociones si las necesitas. Esta pelea pondrá a prueba todo lo que has aprendido hasta ahora.Si vuelves con vida, ya no serás solo un recluta. Serás alguien capaz de enfrentar amenazas reales.",
        shortDescription: "",
        mainMission: true,
        note: "En la tienda puedes comprar pociones si no eres capaz de matar a un enemigo.",
        missionReq: {
            idMissionDone: [
                IdMissionsList.OTRO_FAVOR_MAS,
            ],
            lvReq: 7
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.MU_RANG, quantity: 1 },
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
        name: "La Venganza de los Lobos Alfa",
        idMission: IdMissionsList.LA_VENGANZA_DE_LOS_LOBOS_ALFA,
        description: "Los aullidos no han cesado desde la última luna. Los lobos alfa grises han empezado a organizarse de una forma que no es natural. Antes eran bestias territoriales, sí, pero ahora atacan en grupo, rodean caminos y emboscan caravanas enteras.Creo que los Netims han despertado algo peor en ellos: no solo agresividad, sino resentimiento. Parecen recordar cada cacería, cada flecha, cada piel tomada por nuestros propios guardias.La ciudad está en peligro, y no tenemos hombres suficientes para contenerlos a todos. Necesito que te adentres en los alrededores y reduzcas su número antes de que sea demasiado tarde.Estos no son lobos comunes: son rápidos, feroces y ciegos de ira. Pero si alguien puede devolver el equilibrio a la frontera, ese eres tú.Muévete, soldado… esta vez no cazas por gloria, cazas por la supervivencia de todos.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.MISION_IMPOSIBLE,
            ],
            lvReq: 12
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.LOBO_ALFA_GRIS_MALDITO, quantity: 8 },
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
        name: "Eco de la Caída Sombría",
        idMission: IdMissionsList.ECO_DE_LA_CAIDA_SOMBRIA,
        description: "Desde el Día de la Caída Sombría, esas malditas piedras Netim han sido una espina clavada en el corazón de estas tierras. Su energía oscura contamina todo lo que toca… y últimamente su influencia se ha vuelto más fuerte.Exploradores han informado que una de esas piedras emergió en las ruinas al sur. Desde su llegada, las bestias del bosque se han vuelto incontrolables, y varios aldeanos juran haber oído voces cuando el viento sopla en esa dirección.Tu misión es simple, pero peligrosa: llega hasta esa piedra y destrúyela. No te acerques demasiado ni la toques con tus manos, su corrupción penetra la carne y el alma por igual.Lleva contigo fuego o magia pura, lo que tengas a mano… y reza para que esa cosa no despierte algo peor antes de que llegues.Si logramos eliminarla, quizás demos un paso más hacia recuperar el equilibrio que el cielo nos arrebató aquel día maldito.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.LA_VENGANZA_DE_LOS_LOBOS_ALFA,
            ],
            lvReq: 14
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.NETIM_DE_BATALLA, quantity: 1 },
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
        name: "Sombras del Eid Blanco",
        idMission: IdMissionsList.SOMBRAS_DEL_EID_BLANCO,
        description: "Algo huele mal en esta aldea… y no me refiero al humo del campo de batalla. He visto movimientos extraños, miradas esquivas… y tengo el presentimiento de que hay un espía entre nosotros.Alguien de dentro está colaborando con los guerreros del clan del Eid Blanco. No sé quién, pero lo sabré pronto… y cuando eso ocurra, no habrá piedad.Necesito tu ayuda, soldado. Sal fuera de las murallas y acaba con los Soldados del Eid Blanco que patrullan los caminos cercanos. Puede que entre sus pertenencias encuentres pistas sobre quién está filtrando información.Mantén los ojos abiertos: no confíes en nadie, ni siquiera en aquellos que conoces desde hace años. En tiempos como estos, las dagas suelen venir desde las sombras… no desde el frente.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.ECO_DE_LA_CAIDA_SOMBRIA,
            ],
            lvReq: 18
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.SOLDADO_BLANCO_DE_EIL, quantity: 7 },
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
        name: "El Despertar de Sung Mahi",
        idMission: IdMissionsList.EL_DESPERTAR_DE_SUNG_MAHI,
        description: "Las rocas Netim… maldita sea, cada día aparecen más. Al principio creí que eran simples fragmentos caídos del cielo, pero ahora… ahora parecen multiplicarse por voluntad propia.Cada nueva roca corrompe la tierra a su alrededor: las bestias se vuelven salvajes, los aldeanos enferman, y hasta el aire se siente más pesado. Si esto continúa, la ciudad no resistirá mucho más.Algunos chamanes aseguran que Sung Mahi, el dios del caos, ha despertado de su letargo. No sé si creerles… pero algo oscuro se está moviendo bajo nuestros pies, y no pienso quedarme de brazos cruzados.Debemos actuar antes de que el daño sea irreversible. Encuentra esas rocas y destrúyelas una por una. Que el estruendo de su ruptura sea la señal de que todavía luchamos por estas tierras.Ve, soldado… y que tu voluntad sea más firme que la piedra misma.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.SOMBRAS_DEL_EID_BLANCO,
            ],
            lvReq: 27
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.NETIM_NEGRO, quantity: 4 },
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
        name: "El Secreto de las Rocas Netim",
        idMission: IdMissionsList.EL_SECRETO_DE_LAS_ROCAS_NETIM,
        description: "Tienes talento, eso es indudable.Escucha con atención, soldado. Ya sabes qué son las Rocas Netim: fragmentos caídos del cielo, cargados con una energía oscura que envenena la tierra, propaga plagas y convierte a las bestias en monstruos sin control.Durante meses he intentado estudiar su naturaleza, pero es como si las leyes del mundo no se aplicaran a ellas. Ningún metal las corta, ningún hechizo las afecta por completo.Hasta hace poco.He encontrado algo… una posible clave. Una señal dentro de la piedra, un pulso que parece responder a cierta frecuencia mágica. Si logramos entenderlo, podríamos descubrir de dónde vienen… o peor aún, por qué están cayendo.Necesito fragmentos intactos de las Rocas Netim para continuar la investigación. No los destruyas, recógelos con cuidado y tráelos directamente a mí.Si lo que sospecho es cierto, estas piedras no son simples desechos del cielo… son mensajeros de algo mucho más antiguo, y su caída no fue un accidente.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.EL_DESPERTAR_DE_SUNG_MAHI,
            ],
            lvReq: 30
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.NETIM_DE_OSCURIDAD, quantity: 5 },
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
        name: "La Primera Señal",
        idMission: IdMissionsList.LA_PRIMERA_SEÑAL,
        description: "Al fin lo entiendo… o al menos, una parte de ello.Usando los fragmentos de las piedras Netim, logré forjar una herramienta capaz de captar las frecuencias mágicas que emiten. Lo que descubrí me heló la sangre: una presencia poderosa, antigua… viva.La señal proviene de una criatura conocida en viejas leyendas como Tigris, un semidiós animal que alguna vez protegió estas tierras. Pero algo cambió. Los Netim lo maldijeron, lo corrompieron hasta lo más profundo de su alma. Ahora su fuerza no sirve al equilibrio, sino al caos.He rastreado su ubicación hasta las ruinas del valle oriental. Allí, la energía oscura es tan densa que la tierra misma parece respirar.Tu misión es clara, aunque difícil: encuentra a Tigris y elimínalo. No será una simple cacería; estarás enfrentando a una voluntad divina retorcida por la corrupción.Trae lo que puedas de su cuerpo o su esencia. Quizás en su caída encontremos las respuestas que los Netim han mantenido ocultas desde el Día de la Caída Sombría.Ve, soldado… y recuerda: no luchas solo contra una bestia, sino contra el eco de los dioses.",
        shortDescription: "",
        mainMission: true,
        note: "Los mobs con calavera dorada son jefes muy poderosos pero con grandes recompensas",
        missionReq: {
            idMissionDone: [
                IdMissionsList.EL_SECRETO_DE_LAS_ROCAS_NETIM,
            ],
            lvReq: 32
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.TIGRIS, quantity: 1 },
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
        name: "En Busca De Explicaciones",
        idMission: IdMissionsList.EN_BUSCA_DE_EXPLICACIONES,
        description: "Los resultados de la traducción son… inquietantes.He logrado descifrar parte de las frecuencias mágicas captadas por la herramienta, pero hay símbolos que no pertenecen a ningún lenguaje humano conocido. Son más antiguos, más primitivos… casi vivos.Entre los registros antiguos encontré referencias a glifos similares usados por los orcos hace siglos, en rituales prohibidos de invocación y control espiritual. Puede que ellos, o sus descendientes, aún conserven ese conocimiento.Necesito que los busques. Derrota a los orcos que habitan las montañas negras y revisa sus pertenencias: pergaminos, tablillas, cualquier cosa que contenga esos símbolos.No te equivoques, soldado. No estás cazando simples bestias; estás adentrándote en los restos de una civilización que alguna vez comprendió el lenguaje de los dioses… y lo corrompió.Trae todo lo que encuentres. Quizás, entre la sangre y la ceniza, hallemos la clave para entender qué fue lo que realmente cayó del cielo aquel día.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.LA_PRIMERA_SEÑAL,
            ],
            lvReq: 34
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.EXPLORADOR_ORCO, quantity: 3 },
                { idMob: IdMob.ORCO_MAGO, quantity: 3 },
                { idMob: IdMob.ORCO_GRANDE_OSADO, quantity: 3 },
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
        name: "La Ambición Salvaje",
        idMission: IdMissionsList.LA_AMBICION_SALVAJE,
        description: "Esto se complica más de lo que imaginaba. Los interceptos de los exploradores llegan confusos: hay demasiado ruido, interrupciones en las lecturas… como si alguien estuviera interfiriendo deliberadamente.Lo que sí lograron confirmar es más grave: no somos los únicos tras estos secretos. Un grupo organizado que llaman los Salvajes —no simples bandidos, sino una sociedad pactada por la ambición— ha estado escarbando en las mismas ruinas y buscando las mismas respuestas. No lo hacen por curiosidad. Lo hacen por poder. Y con este tipo de poder, harían del mundo un lugar peor.Tu misión es clara y sin rodeos: entra en sus campamentos, rompe sus cadenas de suministro, destruye sus puntos de reunión y elimina a sus líderes cuando sea necesario. Sabotea sus escritos, quema sus tablillas y desentierra cualquier sitio donde intenten canalizar la energía Netim.No busques gloria; busca eficacia. Estos salvajes son astutos: esperan emboscadas y saben retorcer rituales. Trabaja con cautela, pero no dejes que se afiancen. Cada acción que tomes ahora nos da ventaja en la carrera por entender —y, con suerte, detener— lo que realmente está detrás de las Rocas Metin.Trae documentos, prisiones si puedes, y sobre todo pruebas de sus planes. Si logramos entorpecerlos lo suficiente, podremos tomar la delantera y evitar que la ambición de esos herejes siembre más caos.Ve y córtales el paso. Que sepan que aquí la ley no es la de los salvajes.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.EN_BUSCA_DE_EXPLICACIONES,
            ],
            lvReq: 38
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.ARQUERO_BRUTAL, quantity: 5 },
                { idMob: IdMob.BO, quantity: 3 },
                { idMob: IdMob.KYUK_JANG, quantity: 5 },
                { idMob: IdMob.PHO_HWAN, quantity: 5 },
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
        name: "La Segunda Señal",
        idMission: IdMissionsList.LA_SEGUNDA_SENAL,
        description: "He estado escuchando las piezas encajar, soldado. Aquello por lo que tanto hemos peleado no es sólo leyenda: gran parte del conocimiento sobre los Netim —sus ritmos, símbolos y métodos de corrupción— está en manos del Comandante de los Salvajes. No será un enfrentamiento limpio ni rápido.Tu misión es simple en propósito y compleja en ejecución: entra, derrota al Comandante y recupera cualquier documento, sello o bitácora que guarde.Ten en cuenta: él no pelea sólo con acero. Usa a sus hombres como muro y a sus ritualistas como armas. Rompe sus formaciones, desarma sus lugares de culto y no dejes que retirada alguna se convierta en oportunidad para reagruparse.Si logras traer su sello o su bitácora, no sólo habremos ganado información: habremos arrebatado la ventaja a quienes quieren usar esta miseria para dominar. Ve con cautela… y vuelve con la evidencia. La ciudad depende de lo que traigas.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.LA_AMBICION_SALVAJE,
            ],
            lvReq: 41
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.COMANDANTE_BRUTAL, quantity: 1 },
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
        name: "Arenas Movidizas",
        idMission: IdMissionsList.ARENAS_MOVIDIZAS,
        description: "Malditos insectos del desierto… unos bandidos nos han arrebatado fragmentos de la investigación sobre los Netim. No sólo es información: son pistas, marcas y notas que podrían explicar cómo actúan esas piedras. Si llegan a venderlo o usarlo, habremos cavado nuestra propia tumba.Los rastros apuntan a caravanas errantes y a un puesto cercano al Valle de las Arenas. Esos rufianes conocen bien las dunas: se esconden entre los vientos, emboscan a la noche y desaparecen con la marea de polvo.Quiero que los persigas, acabes con ellos y recuperes todo lo que robaron. No distingas entre líderes y lacayos: si la información estuvo en manos de cualquiera de ellos, debemos recuperarla intacta. Busca pergaminos, cofres, o incluso tatuajes o marcas que indiquen a quién pudieron vendérsela.Actúa con rapidez y sin piedad. En el desierto, la espera es muerte; en nuestras manos, esa información es la diferencia entre sobrevivir y sucumbir. Trae las pruebas, y la ciudad te lo agradecerá… de palabra y de hecho.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.LA_SEGUNDA_SENAL,
            ],
            lvReq: 47
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.BANDIDO_DEL_DESIERTO, quantity: 7 },
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
        name: "Recetario I",
        idMission: IdMissionsList.RECETARIO_I,
        description: "Las señales se apagan por momentos. La herramienta me dice palabras a medias; su voz se quiebra cuanto más lejos escarbo. El encantador tiene la solución: puede aumentar su rango de recepción y filtrar el ruido… pero no puede hacerlo sin ayuda.La primera fase de la renobación requiere materiales concretos —elementos tomados de las serpientes que ahora pueblan los desiertos y las rutas—. Necesita colas de serpiente para construir conductos flexibles que transmitan la frecuencia, y pieles para forrar el receptor y aislarlo de la corrupción.No será un paseo: esas serpientes son más grandes y agresivas que antes, y sus nidos están sembrados en zonas donde las Piedras Netim laten con fuerza. Ve con cuidado, elimina las crías y a sus guardianes, y trae lo necesario intacto.Haz esto y el encantador aumentará el alcance del dispositivo: quizá por fin podamos escuchar la verdad completa detrás de las Rocas Netim. No falles —sin esa mejora, nuestras búsquedas seguirán siendo eco y ruido.Ve ya: cada día que pasa la señal se debilita, y con ella, nuestra ventaja.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.ARENAS_MOVIDIZAS,
            ],
            lvReq: 48
        },
        missionProgress: {
            isDone: false,
            collectProgress: [
                { idItem: IdItem.COLA_DE_SERPIENTE, quantity: 1 },
                { idItem: IdItem.PIEL_DE_SERPIENTE, quantity: 1 },
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
        name: "Recetario II",
        idMission: IdMissionsList.RECETARIO_II,
        description: "Estamos cerca de lograrlo, soldado. El encantador ha trabajado sin descanso, pero para la última renovación del artefacto necesitamos materiales aún más peligrosos.El diente de orco servirá como núcleo conductor, capaz de enfocar la energía de las frecuencias Netim hacia el receptor. Y el saco de veneno de araña nos permitirá filtrar la corrupción residual, aislando la interferencia que las piedras provocan en su entorno.No será tarea sencilla: los orcos están alerta y protegerán sus colmillos como si fueran tesoros de guerra. Las arañas, por su parte, se han multiplicado alrededor de las Piedras Netim y son más agresivas que nunca, sus picaduras llevan la esencia corrupta de la piedra.Ve, obtén ambos materiales y trae todo con cuidado. El encantador ensamblará el artefacto, y entonces por fin podremos captar la señal completa.No olvides: cada día que pasa sin esto nos aleja de la verdad y acerca a los Netim a desatar más caos. Esta es nuestra última oportunidad.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.RECETARIO_I,
            ],
            lvReq: 49
        },
        missionProgress: {
            isDone: false,
            collectProgress: [
                { idItem: IdItem.DIENTE_DE_ORCO, quantity: 2 },
                { idItem: IdItem.SACO_DE_VENENO_DE_ARANA, quantity: 2 },
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
        name: "La Tercera Señal",
        idMission: IdMissionsList.LA_TERCERA_SENAL,
        description: "Hemos afinado la señal y no me gusta lo que escucho: la frecuencia proviene del corazón de la fortaleza orca. Allí reina una aberración —un jefe orco de dos cabezas— más grande y más salvaje de lo que cualquiera haya visto.No es sólo fuerza bruta: cada cabeza razona por separado, coordinan ataques y cubren las debilidades del otro. Tu misión es entrar en su guarida, acabar con esa monstruosidad y recuperar cualquier cosa que lleve sobre su persona: sellos, tablillas o cualquier objeto con inscripciones. Si logramos traducir su lengua y sus señales, tendremos otra pieza más para entender los secretos de las Rocas Netim.Ve preparado. Rompe los flancos, no te fíes de embestidas directas y evita que la criatura se refugie en sus cámaras internas: allí es donde guardan sus reliquias más peligrosas.El tiempo apremia; cada día que pasa esa información puede ser usada contra nosotros. Vuelve con pruebas, vive y deja vivir a quienes merezcan vivir. Hazlo por la ciudad… y por la verdad.",
        shortDescription: "",
        mainMission: true,
        note: "",
        missionReq: {
            idMissionDone: [
                IdMissionsList.RECETARIO_II,
            ],
            lvReq: 51
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.JEFE_ORCO, quantity: 1 },
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
]