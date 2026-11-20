import { Injectable } from '@nestjs/common';
import type { GetMobInfoRequest, GetMobInfoResponse, GetMobsByUbicationRequest, GetMobsByUbicationResponse } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../character/const/characterProps/base-character-stats.const';
import { MobDropPreviewService } from '../../drop/service/mob-drop-preview.service';
import { MobInfoService } from './mob-info.service';

@Injectable()
export class MobOrchestratorService {
    constructor(
        private readonly mobInfoService: MobInfoService,
        private readonly mobDropPreviewService: MobDropPreviewService,
    ) {}

    getMobsByUbication({ ubication }: GetMobsByUbicationRequest): GetMobsByUbicationResponse {
        return this.mobInfoService.getMobsByUbication(ubication);
    }

    /** Devuelve la ficha del mob y su tabla de drops sin bonus de personaje. */
    getMobInfo({ idMob }: GetMobInfoRequest): GetMobInfoResponse {
        const mob = this.mobInfoService.getMobInfo(idMob);
        const drop = this.mobDropPreviewService.getMobDropPreview(mob, GENERAL_CHARACTER_STATS.bonus.miscs);
        return { mob, drop };
    }
}
