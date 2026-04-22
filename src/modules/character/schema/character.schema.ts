import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DiscoveryWorld } from "../types/characterProps/discovery-world.type";
import { StarDiscovery } from "../types/characterProps/stars-discovery.type";
import { ReinosNames } from "src/modules/gameData/types/reinos-names.type";
import { AppliedBuffos } from "../types/characterProps/buffos-in-character.type";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { EquipoOptions } from "../types/characterProps/equipo-options.type";
import { GremioOptions } from "../types/characterProps/gremio-options.type";
import { CharacterStats } from "../types/characterProps/character-stats.type";
import { CharacterRole } from "../types/characterProps/character-role.enum";
import { MonturaType } from "src/modules/item/types/entities-props/montura.type";
import { MissionOption } from "../types/characterProps/mission-option.type";
import { DungeonInProgressType } from "../types/characterProps/dungeon-in-progress.type";
import { PvpDataType } from "../types/characterProps/pvp-data.type";
import { BASE_DISCOVERY_WORLD } from "../const/characterProps/base-discovery-world.const";
import { BASE_EQUIPO_OPTIONS } from "../const/characterProps/base-equipo-options.const";
import { EXP_PER_LV } from "../const/exp-per-lv.const";
import { BASE_PVP_DATA } from "../const/characterProps/base-pvp-data-default.const";
import { BASE_DUNGEON_IN_PROGRESS } from "../const/characterProps/base-dungeon-in-progress.const";
import { BASE_MISSION_IN_PROGRESS } from "../const/characterProps/base-mission-in-progress.const";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class CharacterModel {
    @Prop({ type: String, unique: true, required: true })
    nombre!: string;

    @Prop({ type: Object, default: BASE_DISCOVERY_WORLD })
    discovery_world!: DiscoveryWorld;

    @Prop({ type: Array, default: [] })
    stars_discovery!: StarDiscovery[];

    @Prop({ type: Object, default: { x: 0, y: 0 } })
    icono!: { x: number, y: number };

    @Prop({ type: Number, default: () => Date.now() - 5 * 60 * 1000 })
    timer_mob!: number;

    @Prop({ type: Number, default: () => Date.now() - 5 * 60 * 1000 })
    timer_metin!: number;

    @Prop({ type: Number, default: () => Date.now() - 5 * 60 * 1000 })
    timer_pvp!: number;

    @Prop({ type: Number, default: () => Date.now() - 5 * 60 * 1000 })
    timer_boss!: number;

    @Prop({ type: Number, default: 0 })
    timer_lv!: number;

    @Prop({ type: String, required: true })
    reino!: ReinosNames

    @Prop({ type: String, required: true })
    genero!: 'Femenino' | 'Masculino'

    @Prop({ type: Number, default: 0 })
    puntos_atributos!: number;

    @Prop({ type: Number, default: 0 })
    puntos_habilidad!: number;

    @Prop({ type: Array, default: [] })
    buffos!: AppliedBuffos[];

    @Prop({ type: Array, default: [] })
    inventario!: InventoryItem[];

    @Prop({ type: Array, default: [] })
    equipo_1!: EquipType[];

    @Prop({ type: Array, default: [] })
    equipo_2!: EquipType[];

    @Prop({ type: Array, default: [] })
    equipo_3!: EquipType[];

    @Prop({ type: Object, default: BASE_EQUIPO_OPTIONS })
    equipo_options!: EquipoOptions;

    @Prop({ type: Number, default: 1 })
    equipo_selected!: 1 | 2 | 3;

    @Prop({ type: Number, default: 10})
    yang!: number;

    @Prop({ type: Object })
    gremio_options!: GremioOptions;

    @Prop({ type: Number, default: 1 })
    lv!: number;

    @Prop({ type: Number, default: 0 })
    exp!: number;

    @Prop({ type: Number, default: EXP_PER_LV[1] })
    exp_next_lv!: number;

    @Prop({ type: Number, default: 0 })
    atribute_per_lv!: number;

    @Prop({ type: String, required: true })
    img!: string;

    @Prop({ type: Number, default: 0 })
    time_played!: number;

    @Prop({ type: Object, required: true })
    stats!: CharacterStats;

    @Prop({ type: Number, default: CharacterRole.USER })
    role!: CharacterRole

    @Prop({ type: Object, default: {} })
    montura!: MonturaType;

    @Prop({ type: Number, default: 0 })
    montura_lv!: number;

    @Prop({ type: Number, default: true })
    beginning!: boolean;

    @Prop({ type: Object, default: BASE_MISSION_IN_PROGRESS })
    mission_option!: MissionOption;

    @Prop({ type: Object, default: BASE_DUNGEON_IN_PROGRESS })
    dungeon_in_progress!: DungeonInProgressType;

    @Prop({ type: Object, default: BASE_PVP_DATA })
    pvp_data!: PvpDataType;
}

export type CharacterDocument = HydratedDocument<CharacterModel>

export const characterSchema = SchemaFactory.createForClass(CharacterModel)