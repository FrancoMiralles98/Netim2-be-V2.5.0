import { Injectable } from '@nestjs/common';
import { IdMob } from 'netim2-shared';
import { MobRepository } from './repository/mob.repository';
import { MobModel } from './schema/mob.schema';

@Injectable()
export class MobService {
    constructor(
        private mobRepository: MobRepository
    ) { }

    async getMobByIdMob(id: IdMob): Promise<MobModel> {
        return await this.mobRepository.getMobById(id)
    }

    async getMobsByIdMobs(id: IdMob[]): Promise<MobModel[]> {
        return await this.mobRepository.getMobsByIds(id)
    }


}
