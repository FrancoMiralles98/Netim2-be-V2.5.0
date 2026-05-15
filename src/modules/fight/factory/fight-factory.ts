import { CharacterPersistence } from "src/modules/character/types/character-persistence.type";
import { MobType } from "src/modules/mob/types/mobProps/mob.type";
import { FighterType } from "../types/entites/fight-entity.type";
import { FightEntity } from "../entities/fight-entity";
import { DEFAULT_FIGHT_DETAILS } from "../const/fight-details.const";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { FightDetails } from "../types/entites/fight-details.type";

export class FightFactory {
    createFight(
        fighterA: MobType | CharacterPersistence,
        fighterB: MobType | CharacterPersistence
    ): FightEntity {
        return new FightEntity(
            this.asignFighters(fighterA),
            this.asignFighters(fighterB)
        )
    }


    private asignFighters(fighter: MobType | CharacterPersistence): FighterType {
        return {
            fight_details: this.getDefaultDetailsWithSkills(fighter.hab),
            hab: this.applyCDRToSkills(fighter.hab,fighter.stats.general.vh),
            nombre: fighter.nombre,
            raza: fighter.raza,
            stats: structuredClone(fighter.stats),
            target_type: fighter.target_type,
            type_weapon: fighter.type_weapon,
            spawnConfig: this.isMob(fighter) ? fighter.spawnConfig : undefined
        }
    }


    private getDefaultDetailsWithSkills(habPool: SkillType[]): FightDetails {
        const fightDetails = structuredClone(DEFAULT_FIGHT_DETAILS)

        for (const hab of habPool) {
            if (hab.type === 'Daño') {
                fightDetails.skills_used.push({
                    cdSkill: 0,
                    Dps: 0,
                    idSkill: hab.idSkill,
                    isLearned: typeof hab.lv === 'string' ? true : hab.lv > 0 ? true : false,
                    maxDmg: 0,
                    timesUsed: 0
                })
            }
        }

        return fightDetails
    }

    private applyCDRToSkills(hab:SkillType[],vh:number): SkillType[] {
        const updatedSkills = structuredClone(hab)

        for (const skill of updatedSkills) {
            if (skill.type === 'Daño') {
                skill.cd = vh !== 0 
                ? Math.round(Math.max(0,skill.cd - skill.cd * (vh / 100) ))
                : skill.cd
            }
        }

        return updatedSkills
    }

    private isMob(fighter: MobType | CharacterPersistence): fighter is MobType {
        return 'idMob' in fighter
    }
}