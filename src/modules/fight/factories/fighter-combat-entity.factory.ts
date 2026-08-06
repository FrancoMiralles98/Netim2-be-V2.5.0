import { Injectable } from "@nestjs/common";
import { FighterCombatCreationInput } from "./fighter-combat-factory.types";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { FighterBaseStats } from "../types/fighter/fight-base-stats.type";
import { Stats } from "netim2-shared";

@Injectable()
export class FighterCombatFactory {
    createFighter(input: FighterCombatCreationInput) {

        return new FighterCombatEntity({
            baseStats: this.transformToFighterBaseStats(input.stats),
            id: input.id,
            name: input.name,
            skills: input.skills,
            targetType: input.targetType,
            race: input.race,
            weaponType: input.weaponType
        })
    }

    private transformToFighterBaseStats(stats: Stats): FighterBaseStats {
        return {
            general: {
                ad: stats.general.ad,
                ap: stats.general.ap,
                def: stats.general.def,
                hp: stats.general.hp,
                mana: stats.general.mana,
                regenHp: stats.general.regen_hp,
                regenMana: stats.general.regen_mana,
                va: stats.general.va,
                vh: stats.general.vh,
                vm: stats.general.vm
            },
            bonus: { ...stats.bonus }
        }
    }
}