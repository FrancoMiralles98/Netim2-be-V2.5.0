import { mergeStats } from "src/modules/shared/functions/marge-stats.function";
import { MOB_BASE_STATS } from "../const/mobProps/mob-base-stats.const";
import { MobCoreData } from "../types/mobProps/mob-core-data.type";
import { MobStats } from "../types/mobProps/mob-stats.type";
import { MobType } from "../types/mobProps/mob.type";

export class MobFactory {

    create(data: MobCoreData): MobType {
        return {
            ...data,
            stats: this.getFullStats(data.stats)
        }
    }

    createMany(data: MobCoreData[]): any {
        return data.map(d=> this.create(d))
    }


    private getFullStats(statsCore: MobCoreData['stats']): MobStats {
        if (!statsCore) {
            return MOB_BASE_STATS
        } else {
            return mergeStats(MOB_BASE_STATS, statsCore)
        }
    }

}