import { BASE_DISCOVERY_WORLD } from "./characterProps/base-discovery-world.const";
import { BASE_DUNGEON_IN_PROGRESS } from "./characterProps/base-dungeon-in-progress.const";
import { BASE_EQUIPO_OPTIONS } from "./characterProps/base-equipo-options.const";
import { BASE_PVP_DATA } from "./characterProps/base-pvp-data-default.const";
import { EXP_PER_LV } from "./exp-per-lv.const";
import { CharacterRole } from "../types/baseCharacterProps/character-role.enum";
import { GENERAL_CHARACTER_STATS } from "./characterProps/base-character-stats.const";
import { CharacterPersistence } from "netim2-shared";

export const GENERAL_CHARACTER: CharacterPersistence = {
    beginning: true,
    atribute_per_lv: 0,
    buffos: [],
    discovery_world: BASE_DISCOVERY_WORLD,
    dungeon_in_progress: BASE_DUNGEON_IN_PROGRESS,
    equipo_1: [],
    equipo_2: [],
    atributos: {
        DEX: {lvPoints:0,bonusPoints:0},
        INT: {lvPoints:0,bonusPoints:0},
        STR: {lvPoints:0,bonusPoints:0},
        VIT: {lvPoints:0,bonusPoints:0},
    },
    fightConfig: {
        allies: {},
        enemies: {
            focus: true,
            selector: 'less_max_hp'
        },
        self: {
            HealingSkillHpThresholdPercent: 60,
            priorityBassicAttack: false,
            reactiveAuras: true,
            skillPriority: ['more_damage']
        }
    },
    equipo_3: [],
    equipo_options: BASE_EQUIPO_OPTIONS,
    equipo_selected: 1,
    exp: 0,
    exp_next_lv: EXP_PER_LV[1],
    genero: 'masculino',
    hab: [],
    historial: [],
    inventario: [],
    lv: 1,
    mission_option: {
        idMissionsDone: [],
        missionsInProgress: []
    },
    montura_lv: 0,
    nombre: '',
    party: [],
    puntos_atributos: 0,
    puntos_habilidad: 0,
    pvp_data: BASE_PVP_DATA,
    raza: 'guerrero',
    reino: 'shinsoo',
    role: CharacterRole.USER,
    stars_discovery: [],
    stats: GENERAL_CHARACTER_STATS,
    target_type: 'medio_humanos',
    time_played: 0,
    timer_boss: Date.now(),
    timer_metin: Date.now(),
    timer_mob: Date.now(),
    timer_pvp: Date.now(),
    timer_lv: 15,
    type_weapon: '',
    yang: 0,
}