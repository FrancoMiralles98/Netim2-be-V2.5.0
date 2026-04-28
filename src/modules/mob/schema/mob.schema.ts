import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UbicationNames } from "src/modules/gameData/types/ubication-names.type";
import { MobStats } from "../types/mobProps/mob-stats.type";
import { DropsChance } from "../types/mobProps/drop-chance.type";
import { GenericDrop } from "../types/mobProps/generic-drop.type";
import { SpecificDrop } from "../types/mobProps/specific-drop.type";
import { SpawnConfig } from "../types/mobProps/spawn-config.type";
import { HydratedDocument } from "mongoose";
import { IdMobList } from "../types/id-mob-list.enum";

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

    @Prop({ type: Number, required: true, unique:true })
    idMob!: IdMobList;

    @Prop({ type: Object, required: true })
    yang!: { min: number, max: number };

    @Prop({ type: Object, required: true })
    exp!: { min: number, max: number };

    @Prop({ type: Object, required: true })
    stats!: MobStats;

    @Prop({ type: Object, required: true })
    dropChance!: DropsChance;

    @Prop({ type: Object, required: true })
    genericDrop!: GenericDrop;

    @Prop({ type: Object, required: true })
    specificDrop!: SpecificDrop;

    @Prop({ type: Number, required: true })
    quantityDrop!: number;

    @Prop({ type: Number, required: true })
    discovery!: number;
}

export type MobDocument = HydratedDocument<MobModel>

export const mobSchema = SchemaFactory.createForClass(MobModel)