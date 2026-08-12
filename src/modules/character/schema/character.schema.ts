import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DiscoveryWorld } from "../types/baseCharacterProps/discovery-world.type";
import { StarDiscovery } from "../types/baseCharacterProps/stars-discovery.type";
import { ReinosNames } from "src/modules/gameData/reinos/reinos-names.type";
import { AppliedBuffos } from "../types/baseCharacterProps/buffos-in-character.type";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { EquipType, TypeWeapon } from "src/modules/item/types/entities-props/equip.type";
import { EquipoOptions } from "../types/baseCharacterProps/equipo-options.type";
import { GremioOptions } from "../types/baseCharacterProps/gremio-options.type";
import { CharacterRace, CharacterSpeciality } from "../types/baseCharacterProps/character-stats.type";
import { CharacterRole } from "../types/baseCharacterProps/character-role.enum";
import { MonturaType } from "src/modules/item/types/entities-props/montura.type";
import { MissionOption } from "../types/baseCharacterProps/mission-option.type";
import { DungeonInProgressType } from "../types/baseCharacterProps/dungeon-in-progress.type";
import { PvpDataType } from "../types/baseCharacterProps/pvp-data.type";
import { BASE_DISCOVERY_WORLD } from "../const/characterProps/base-discovery-world.const";
import { BASE_EQUIPO_OPTIONS } from "../const/characterProps/base-equipo-options.const";
import { EXP_PER_LV } from "../const/exp-per-lv.const";
import { BASE_PVP_DATA } from "../const/characterProps/base-pvp-data-default.const";
import { BASE_DUNGEON_IN_PROGRESS } from "../const/characterProps/base-dungeon-in-progress.const";
import { BASE_MISSION_IN_PROGRESS } from "../const/characterProps/base-mission-in-progress.const";
import { HydratedDocument } from "mongoose";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { Atributos, FightConfig, SkillType, Stats } from "netim2-shared";

@Schema({ timestamps: true })
export class CharacterModel {
    @Prop({ type: String, unique: true, required: true })
    nombre!: string;

    @Prop({ type: Object, default: BASE_DISCOVERY_WORLD })
    discovery_world!: DiscoveryWorld;

    @Prop({ type: Array, default: [] })
    stars_discovery!: StarDiscovery[];

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
    genero!: 'femenino' | 'masculino'

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

    @Prop({ type: Number, default: 0 })
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

    @Prop({ type: Number, default: 0 })
    time_played!: number;

    @Prop({ type: Object, required: true })
    baseStats!: Stats;

    @Prop({ type: Object, required: true })
    atributos!: Atributos;

    @Prop({ type: String, default: CharacterRole.USER })
    role!: CharacterRole

    @Prop({ type: Object })
    montura!: MonturaType;

    @Prop({ type: Number, default: 0 })
    montura_lv!: number;

    @Prop({ type: Boolean, default: true })
    beginning!: boolean;

    @Prop({ type: Object, default: BASE_MISSION_IN_PROGRESS })
    mission_option!: MissionOption;

    @Prop({ type: Object, default: BASE_DUNGEON_IN_PROGRESS })
    dungeon_in_progress!: DungeonInProgressType;

    @Prop({ type: Object, default: BASE_PVP_DATA })
    pvp_data!: PvpDataType;

    @Prop({ type: Array, default: [] })
    hab!: SkillType[];

    @Prop({ type: String })
    especialidad!: CharacterSpeciality;

    @Prop({ type: String, required: true })
    raza!: CharacterRace;

    @Prop({ type: String, required: true })
    target_type!: Extract<AllTargetType, 'medio_humanos'>;

    @Prop({ type: String, default: '' })
    type_weapon!: TypeWeapon | '';

    @Prop({ type: String, required: true })
    user_owner!: string;

    @Prop({ type: Object, required: true })
    fightConfig!: FightConfig
}

export type CharacterDocument = HydratedDocument<CharacterModel>

export const characterSchema = SchemaFactory.createForClass(CharacterModel)