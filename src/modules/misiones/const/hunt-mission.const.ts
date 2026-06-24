import { IdMob } from "src/modules/mob/types/id-mob-list.enum";
import { HuntMission } from "../types/hunt-mission.type";
import { IdMissionsList } from "../types/idMissions/id-mission-list.enum";

export const HUNT_MISSION: HuntMission[] = [
    {
        name: "Misión de Caza 1",
        idMission: IdMissionsList.MISION_DE_CAZA_1,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 2
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
        name: "Misión de Caza 2",
        idMission: IdMissionsList.MISION_DE_CAZA_2,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 4
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.LOBO_ALFA, quantity: 4 },
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
        name: "Misión de Caza 3",
        idMission: IdMissionsList.MISION_DE_CAZA_3,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 6
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.JABALI, quantity: 3 },
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
        name: "Misión de Caza 4",
        idMission: IdMissionsList.MISION_DE_CAZA_4,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 8
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.JABALI, quantity: 3 },
                { idMob: IdMob.OSO, quantity: 2 },
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
        name: "Misión de Caza 5",
        idMission: IdMissionsList.MISION_DE_CAZA_5,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 10
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.JABALI, quantity: 4 },
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
        name: "Misión de Caza 6",
        idMission: IdMissionsList.MISION_DE_CAZA_6,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 12
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.OSO, quantity: 6 },
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
        name: "Misión de Caza 7",
        idMission: IdMissionsList.MISION_DE_CAZA_7,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 14
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.MU_RANG, quantity: 3 },
                { idMob: IdMob.OSO, quantity: 4 },
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
        name: "Misión de Caza 8",
        idMission: IdMissionsList.MISION_DE_CAZA_8,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 16
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.LOBO_ALFA_GRIS_MALDITO, quantity: 7 },
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
        name: "Misión de Caza 9",
        idMission: IdMissionsList.MISION_DE_CAZA_9,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 18
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.TIGRE, quantity: 8 },
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
        name: "Misión de Caza 10",
        idMission: IdMissionsList.MISION_DE_CAZA_10,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 20
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.SOLDADO_BLANCO_DE_EIL, quantity: 6 },
                { idMob: IdMob.ARQUERO_BLANCO_DEL_EID, quantity: 6 },
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
        name: "Misión de Caza 11",
        idMission: IdMissionsList.MISION_DE_CAZA_11,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 22
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.SOLDADO_BLANCO_DE_EIL, quantity: 5 },
                { idMob: IdMob.ARQUERO_BLANCO_DEL_EID, quantity: 5 },
                { idMob: IdMob.COMANDANTE_BLANCO_DE_EID, quantity: 3 },
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
        name: "Misión de Caza 12",
        idMission: IdMissionsList.MISION_DE_CAZA_12,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 24
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.COMANDANTE_BLANCO_DE_EID, quantity: 11 },
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
        name: "Misión de Caza 13",
        idMission: IdMissionsList.MISION_DE_CAZA_13,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 26
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.TIGRE_BLANCO_MALDITO, quantity: 8 },
                { idMob: IdMob.EUN_JUNG, quantity: 5 },
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
        name: "Misión de Caza 14",
        idMission: IdMissionsList.MISION_DE_CAZA_14,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 28
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.EUN_JUNG, quantity: 9 },
                { idMob: IdMob.SE_RANG, quantity: 9 },
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
        name: "Misión de Caza 15",
        idMission: IdMissionsList.MISION_DE_CAZA_15,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 30
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.SOLDADO_DE_INFANTERIA_SALVAJE, quantity: 17 },
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
        name: "Misión de Caza 16",
        idMission: IdMissionsList.MISION_DE_CAZA_16,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 32
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.ARQUERO_DEL_HURACAN_OSCURO, quantity: 12 },
                { idMob: IdMob.EXPLORADOR_ORCO, quantity: 8 },
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
        name: "Misión de Caza 17",
        idMission: IdMissionsList.MISION_DE_CAZA_17,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 34
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.SECUAZ_SALVAJE, quantity: 7 },
                { idMob: IdMob.ORCO_MAGO, quantity: 7 },
                { idMob: IdMob.ARANA_VENENOSA_VIL, quantity: 7 },
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
        name: "Misión de Caza 18",
        idMission: IdMissionsList.MISION_DE_CAZA_18,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 36
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.JOH_HWAN, quantity: 8 },
                { idMob: IdMob.ORCO_GRANDE_OSADO, quantity: 8 },
                { idMob: IdMob.REY_ESCORPION, quantity: 8 },
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
        name: "Misión de Caza 19",
        idMission: IdMissionsList.MISION_DE_CAZA_19,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 38
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.KYUK_JANG, quantity: 10 },
                { idMob: IdMob.LUCHADOR_ORCO_ELITE, quantity: 9 },
                { idMob: IdMob.REY_ESCORPION, quantity: 10 },
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
        name: "Misión de Caza 20",
        idMission: IdMissionsList.MISION_DE_CAZA_20,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 40
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.FANATICO_OSCURO, quantity: 8 },
                { idMob: IdMob.ARAHAN_OSCURO, quantity: 8 },
                { idMob: IdMob.ESPECIALISTA_BESTIAL, quantity: 10 },
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
        name: "Misión de Caza 21",
        idMission: IdMissionsList.MISION_DE_CAZA_21,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 42
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.GRAN_ARAHAN_ELITE, quantity: 14 },
                { idMob: IdMob.MAHON, quantity: 13 },
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
        name: "Misión de Caza 22",
        idMission: IdMissionsList.MISION_DE_CAZA_22,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 44
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.TORTURADOR_OSCURO, quantity: 13 },
                { idMob: IdMob.CHOUNG, quantity: 13 },
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
        name: "Misión de Caza 23",
        idMission: IdMissionsList.MISION_DE_CAZA_23,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 46
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.ARQUERO_ESCORPION, quantity: 12 },
                { idMob: IdMob.ORCO_NEGRO, quantity: 13 },
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
        name: "Misión de Caza 24",
        idMission: IdMissionsList.MISION_DE_CAZA_24,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 48
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.HOMBRE_ESCORPION, quantity: 15 },
                { idMob: IdMob.GIGANTE_ORCO_NEGRO, quantity: 12 },
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
        name: "Misión de Caza 25",
        idMission: IdMissionsList.MISION_DE_CAZA_25,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 50
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.ARANA_GARRA_VENENOSA, quantity: 10 },
                { idMob: IdMob.BANDIDO_DEL_DESIERTO, quantity: 9 },
                { idMob: IdMob.GENERAL_ORCO_GRANDE_OSADO, quantity: 11 },
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
        name: "Misión de Caza 26",
        idMission: IdMissionsList.MISION_DE_CAZA_26,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 52
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.SERPIENTE_ESPADACHIN, quantity: 13 },
                { idMob: IdMob.SERPIENTE_ARQUERA, quantity: 13 },
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
        name: "Misión de Caza 27",
        idMission: IdMissionsList.MISION_DE_CAZA_27,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 54
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.HIELO_ENCANTADO_MEZQUINO, quantity: 20 },
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
        name: "Misión de Caza 28",
        idMission: IdMissionsList.MISION_DE_CAZA_28,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 56
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.HOMBRE_PLAGA_FURIOSO, quantity: 14 },
                { idMob: IdMob.SOLDADO_RANA_ARBOREA, quantity: 14 },
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
        name: "Misión de Caza 29",
        idMission: IdMissionsList.MISION_DE_CAZA_29,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 58
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.BICHO_DE_HIELO, quantity: 18 },
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
        name: "Misión de Caza 30",
        idMission: IdMissionsList.MISION_DE_CAZA_30,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 60
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.HOMBRE_DEL_SACO, quantity: 15 },
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
        name: "Misión de Caza 31",
        idMission: IdMissionsList.MISION_DE_CAZA_31,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 62
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.GENERAL_RANA_TORO, quantity: 15 },
                { idMob: IdMob.LANCERO_PLAGA, quantity: 10 },
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
        name: "Misión de Caza 32",
        idMission: IdMissionsList.MISION_DE_CAZA_32,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 64
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.ARQUERO_PLAGA, quantity: 13 },
                { idMob: IdMob.ESPADACHIN_PLAGA, quantity: 10 },
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
        name: "Misión de Caza 33",
        idMission: IdMissionsList.MISION_DE_CAZA_33,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 66
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.LIDER_PLAGA, quantity: 18 },
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
        name: "Misión de Caza 34",
        idMission: IdMissionsList.MISION_DE_CAZA_34,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 68
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.HOMBRE_DE_HIELO, quantity: 17 },
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
        name: "Misión de Caza 35",
        idMission: IdMissionsList.MISION_DE_CAZA_35,
        description: "Recluta, los Netims están corrompiendo estas tierras más rápido de lo que podemos reaccionar. Criaturas que antes eran escasas ahora se multiplican sin control. Si dejamos que sigan creciendo en número, pronto ni las murallas de la ciudad nos protegerán. Necesito que salgas ahí afuera y reduzcas su población. Según tu nivel actual, habrá distintas bestias que podrás enfrentar… tómalo como un entrenamiento, pero también como tu deber de proteger a esta ciudad. Ve y cumple con tu parte en este equilibrio.",
        shortDescription: "",
        mainMission: false,
        note: "",
        missionReq: {
            idMissionDone: [],
            lvReq: 70
        },
        missionProgress: {
            isDone: false,
            huntsProgress: [
                { idMob: IdMob.GOLEM_DE_HIELO, quantity: 17 },
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