import { Injectable } from '@nestjs/common';
import type { GetMobInfoRequest, GetMobInfoResponse, GetMobsByUbicationRequest, GetMobsByUbicationResponse } from 'netim2-shared';
import { MobInfoService } from './mob-info.service';

@Injectable()
export class MobOrchestratorService {
    constructor(private readonly mobInfoService: MobInfoService) {}

    getMobsByUbication({ ubication }: GetMobsByUbicationRequest): GetMobsByUbicationResponse {
        return this.mobInfoService.getMobsByUbication(ubication);
    }

    getMobInfo({ idMob }: GetMobInfoRequest): GetMobInfoResponse {
        return this.mobInfoService.getMobInfo(idMob);
    }
}
