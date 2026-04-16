const CHAMAN_SKILLS_SCALING = {
    Luz: {
        36: {
            escaladoMain: [0.66, 0.80],
            escaladoLv: [2, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 4, VIT: 4 },
            escaladoEfecto: {
                desmayo: [0, 0],
                veneno: [0, 0],
                incendio: [0, 0],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        33: {
            escaladoMain: [0.65, 1.1],
            escaladoLv: [1.5, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 5, DEX: 1 },
            escaladoEfecto: {
                desmayo: [20, 1.5],
                veneno: [0, 0],
                incendio: [0, 0],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        34: {
            escaladoMain: [0.62, 0.7],
            escaladoLv: [1.5, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 4, DEX: 4 },
            escaladoEfecto: {
                desmayo: [0, 0],
                veneno: [0, 0],
                incendio: [0, 0],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        35: {
            escaladoMain: [0.73, 0.82],
            escaladoLv: [1.5, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 4, STR: 4 },
            escaladoEfecto: {
                desmayo: [0, 0],
                veneno: [0, 0],
                incendio: [0, 0],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        38: {
            escaladoAtributos: { INT: 0.5, STR: 2.5 },
            escaladoBuffos: {
                ad: [[1, [1, 2, 3, 4]], true],
            },
        },
        37: {
            escaladoAtributos: { INT: 0.5, DEX: 1.5 },
            escaladoBuffos: {
                vm: [[0.3, [1.2, 1.4, 1.6, 1.8]], true],
                vh: [[0.3, [1.2, 1.4, 1.6, 1.8]], true],
            },
        },
    },
    Dragón: {
        39: {
            escaladoMain: [0.70, 0.76],
            escaladoLv: [1.5, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 4, DEX: 2 },
            escaladoEfecto: {
                desmayo: [0, 0],
                veneno: [0, 0],
                incendio: [1, 1],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        41: {
            escaladoMain: [0.80, 1.10],
            escaladoLv: [1.5, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 4, DEX: 1, VIT: 3 },
            escaladoEfecto: {
                desmayo: [0, 0],
                veneno: [0, 0],
                incendio: [5, 1.5],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        40: {
            escaladoMain: [0.66, 0.74],
            escaladoLv: [1.5, [2, 4, 6, 8]],
            escaladoAtributos: { INT: 4, DEX: 2 },
            escaladoEfecto: {
                desmayo: [0, 0],
                veneno: [0, 0],
                incendio: [0, 0],
                retardo: [0, 0],
                sangrado: [0, 0]
            },
        },
        42: {
            escaladoAtributos: { INT: 1, STR: 1 },
            escaladoBuffos: {
                critico: [[0.2, [1.1, 1.2, 1.3, 1.4]], true],
            },
        },
        43: {
            escaladoAtributos: { INT: 0.5, VIT: 0.5 },
            escaladoBuffos: {
                def_media: [[0.2, [0.9, 1, 1, 1]], true],
            },
        },
        44: {
            escaladoAtributos: { INT: 1, DEX: 1 },
            escaladoBuffos: {
                reflectar: [[0.4, [1, 1.05, 1.1, 1.2]], true],
            },
        },
    },
}