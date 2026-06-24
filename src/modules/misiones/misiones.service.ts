import { Injectable } from '@nestjs/common';
import { MissionReward, Missions } from './types/mission-base.type';
import { IdMissionsList } from './types/idMissions/id-mission-list.enum';
import { UpdateMissionProgress } from './types/progress-mission.type';
import { MissionProgressService } from './services/mission-progress.service';
import { MissionRewardService } from './services/mission-reward.service';


@Injectable()
export class MisionesService {
    constructor(
        private missionProgressService: MissionProgressService,
        private missionRewardService: MissionRewardService
    ) { }


    updatedMissionsReward(
        missionReward: MissionReward,
        missionLv: number,
        idMission: IdMissionsList
    ): MissionReward {
        const updatedRewards = structuredClone(missionReward)

        updatedRewards.exp = this.missionRewardService.getUpdatedExp(missionLv, missionReward.exp, idMission)
        updatedRewards.items = this.missionRewardService.getItemsRewards(updatedRewards.itemsConfig)

        return updatedRewards
    }

    updateProgressMission(progress: UpdateMissionProgress, missions: Missions[]): Missions[] {
        for (const mision of missions) {
            this.missionProgressService.updateProgressMission(progress, mision)
        }
        return missions
    }



}
