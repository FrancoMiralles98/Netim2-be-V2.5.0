import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";
import type {
    AllTargetType, EnemyType, FightConfig, IdItemList, IdMobList, MobDifficulty,
    MobRace, MobType, SkillType, SpawnConfig, Stats, TypeWeapon, UbicationNames,
} from "netim2-shared";

@Schema()
export class MobModel implements MobType {
    @Prop({ type: String, unique: true, required: true })
    nombre!: string;

    @Prop({ type: Number, required: true })
    lv!: number;

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
    stats!: Stats;

    @Prop({ type: String, default: 'desconocido' })
    raza!: MobRace;

    @Prop({ type: Array, default: [] })
    hab!: SkillType[];

    @Prop({ type: String, required: true })
    enemie_type!: EnemyType;

    @Prop({ type: String, required: true })
    target_type!: AllTargetType;

    @Prop({ type: String })
    type_weapon?: TypeWeapon;

    @Prop({ type: [Number], default: [] })
    specific_drop!: IdItemList[];

    @Prop({ type: Number, required: true })
    discovery!: number;

    @Prop({ type: Object, required: true })
    fightConfig!: FightConfig
}

export type MobDocument = HydratedDocument<MobModel>

export const mobSchema = SchemaFactory.createForClass(MobModel)
