import { CharacterPersistence } from "src/modules/character/types/character-persistence.type";
import { MobType } from "src/modules/mob/types/mobProps/mob.type";
import { FighterType } from "../types/entites/fight-entity.type";
import { FightEntity } from "../entities/fight-entity";
import { DEFAULT_FIGHT_DETAILS } from "../const/entity/fight-details.const";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { FightDetails } from "../types/entites/fight-details.type";
import { DEFAULT_FIGHTER_EFFECT_DESCRIPTION } from "../const/entity/fighter-effect-description.const";
import { Injectable } from "@nestjs/common";

/**
 * Factory encargada de construir una entidad de fight
 * a partir de dos participantes.
 *
 */
@Injectable()
export class FightFactory {

    createFight(
        fighterA: FighterType| MobType | CharacterPersistence,
        fighterB: FighterType| MobType | CharacterPersistence
    ): FightEntity {



        return new FightEntity(
            this.asignFighters(fighterA),
            this.asignFighters(fighterB)
        )
    }

    /**
     * Adapta un mob o personaje al formato interno `FighterType`.
     *
     * @param fighter Participante original.
     * @returns Participante adaptado para combate.
     */
     asignFighters(fighter: FighterType | MobType | CharacterPersistence): FighterType {

        if (this.isFighter(fighter)) {
            return structuredClone(fighter)
        }

        return {
            fight_details: this.getDefaultDetailsWithSkills(fighter.hab),
            hab: fighter.hab,
            nombre: fighter.nombre,
            raza: fighter.raza,
            stats: structuredClone(fighter.stats),
            target_type: fighter.target_type,
            type_weapon: fighter.type_weapon,
            spawnConfig: this.isMob(fighter) ? fighter.spawnConfig : undefined,
            effects: { ...DEFAULT_FIGHTER_EFFECT_DESCRIPTION }
        }
    }


    /**
     * Genera el  fight_details de pelea e inicializa
     * el seguimiento de uso para las habilidades de daño aprendidas
     *
     * @param habPool Pool de habilidades.
     * @returns fight_details inicializada.
     */
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

    private isMob(fighter: MobType | CharacterPersistence): fighter is MobType {
        return 'idMob' in fighter
    }

    private isFighter(fighter: FighterType | MobType | CharacterPersistence): fighter is FighterType {
        return 'effects' in fighter && 'fight_details' in fighter
    }
}