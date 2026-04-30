import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UbicationNames } from "src/modules/gameData/types/ubication-names.type";
import { MobStats } from "../types/mobProps/mob-stats.type";
import { SpawnConfig } from "../types/mobProps/spawn-config.type";
import { HydratedDocument } from "mongoose";
import { IdMobList } from "../types/id-mob-list.enum";
import { CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { SkillType } from "src/modules/skill/types/skill.type";
import { MobRace } from "../types/mobProps/mob-race.type";
import { DropConfig } from "../types/mobProps/drop-config.type";

@Schema()
export class MobModel {
    @Prop({ type: String, unique: true, required: true })
    nombre!: string;

    @Prop({ type: Number, required: true })
    lv!: number;

    @Prop({ type: String, required: true })
    img!: string;

    @Prop({ type: String, required: true })
    ubication!: UbicationNames;

    @Prop({ type: Number, required: true })
    dificultad!: 1 | 2 | 3 | 4;

    @Prop({ type: Object, required: true })
    spawnConfig!: SpawnConfig;

    @Prop({ type: Number, required: true, unique: true })
    idMob!: IdMobList;

    @Prop({ type: Object, required: true })
    yang!: { min: number, max: number };

    @Prop({ type: Object, required: true })
    exp!: { min: number, max: number };

    @Prop({ type: Object, required: true })
    stats!: MobStats;

    @Prop({ type: String, default: 'desconocido' })
    raza!: MobRace;

    @Prop({ type: Array, default: [] })
    hab!: SkillType[];

    @Prop({ type: String, default: "" })
    especialidad!: CharacterSpeciality;

    @Prop({ type: String, required: true })
    target_type!: AllTargetType;

    @Prop({ type: Object, required: true })
    drop_config!: DropConfig;

    @Prop({ type: Number, required: true })
    discovery!: number;
}

export type MobDocument = HydratedDocument<MobModel>

export const mobSchema = SchemaFactory.createForClass(MobModel)