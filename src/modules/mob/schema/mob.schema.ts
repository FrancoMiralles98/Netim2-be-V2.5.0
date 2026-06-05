import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UbicationNames } from "src/modules/gameData/types/ubication-names.type";
import { MobStats } from "../types/mobProps/mob-stats.type";
import { SpawnConfig } from "../types/mobProps/spawn-config.type";
import { HydratedDocument } from "mongoose";
import { IdMobList } from "../types/id-mob-list.enum";
import { CharacterSpeciality } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { AllTargetType } from "src/modules/gameData/types/all-races.type";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { MobRace } from "../types/mobProps/mob-race.type";
import { TypeWeapon } from "src/modules/item/types/entities-props/equip.type";
import { MobDifficulty } from "../types/mobProps/mob-difficult.type";
import { EnemyType } from "../types/mobProps/enemie-type.type";
import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type";

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
    dificultad!: MobDifficulty;

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

    @Prop({ type: String, required: true })
    enemie_type!: EnemyType;

    @Prop({ type: String, default: "" })
    especialidad!: CharacterSpeciality;

    @Prop({ type: String, required: true })
    target_type!: AllTargetType;

    @Prop({ type: String, required: true })
    type_weapon!: TypeWeapon;

    @Prop({ type: Array, default: [] })
    specific_drop!: IdItemList[];

    @Prop({ type: Number, required: true })
    discovery!: number;
}

export type MobDocument = HydratedDocument<MobModel>

export const mobSchema = SchemaFactory.createForClass(MobModel)