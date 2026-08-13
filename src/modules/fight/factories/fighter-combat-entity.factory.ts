import { Injectable } from "@nestjs/common";
import { FighterCombatCreationInput } from "./fighter-combat-factory.types";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { FighterBaseStats } from "../types/fighter/fight-base-stats.type";
import { CharacterPersistence, CharacterPersistenceWithId, Stats, TypeWeapon } from "netim2-shared";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { randomUUID } from "crypto";

@Injectable()
export class FighterCombatFactory {
    createSidesWithMobs(
        fighters: CharacterPersistenceWithId[],
        mobs: MobModel[]
    ): { allies: FighterCombatEntity[], enemies: FighterCombatEntity[] } {
        const allies = fighters.map(fighter => this.createFighter({
            fightConfig: fighter.fightConfig,
            id: fighter.id,
            name: fighter.nombre,
            skills: fighter.hab,
            stats: fighter.stats,
            targetType: fighter.target_type,
            race: fighter.raza,
            weaponType: fighter.type_weapon as TypeWeapon | undefined //corregir esto
        }))
        const enemies = mobs.map(mob => this.createFighter({
            fightConfig: mob.fightConfig,
            id: randomUUID(),
            name: mob.nombre,
            skills: mob.hab,
            stats: mob.stats,
            targetType: mob.target_type,
            race: undefined,
            weaponType: mob.type_weapon
        }))

        return { allies, enemies }
    }


    createFighter(input: FighterCombatCreationInput): FighterCombatEntity {

        return new FighterCombatEntity({
            baseStats: this.transformToFighterBaseStats(input.stats),
            id: input.id,
            name: input.name,
            skills: input.skills,
            targetType: input.targetType,
            race: input.race,
            weaponType: input.weaponType,
            fightConfig: input.fightConfig
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