import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { MobDocument, MobModel } from "../schema/mob.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UbicationNames } from "src/modules/gameData/types/ubication-names.type";
import { MobType } from "../types/mobProps/mob.type";

@Injectable()
export class MobRepository {
    constructor(
        @InjectModel(MobModel.name)
        private mobModel: Model<MobDocument>
    ) { }

    /**
     * Se usa El "IdMob" no el de la base de datos
     */
    async getMobById(idMob: number): Promise<MobModel> {
        const mob = await this.mobModel.findOne({ idMob }).lean()
        if (!mob) {
            throw new NotFoundException('Mob not found')
        }
        return mob
    }

    async getMobsByUbication(ubication: UbicationNames): Promise<MobModel[]> {
        const mobs = await this.mobModel.find({ ubication }).lean()
        if (!mobs) {
            throw new NotFoundException('Mob not found')
        }
        return mobs
    }

    async InsertMobs(mobs: MobType[]): Promise<MobType[]> {
        const result = await this.mobModel.insertMany(mobs)
        if (!result) {
            throw new InternalServerErrorException('Error al crear los mobs')
        }
        return result
    }

    //Estructura base, despues se tiene que mejorar para mayor seguridad
    async updateOneMob(idMob:number,data: MobType): Promise<MobType> {
        const result = await this.mobModel.findOneAndUpdate({idMob},{$set:data})
        if (!result) {
            throw new InternalServerErrorException('Error al crear los mobs')
        }
        return result
    }
}