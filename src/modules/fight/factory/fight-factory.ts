import { CharacterPersistence } from "src/modules/character/types/character-persistence.type";
import { MobType } from "src/modules/mob/types/mobProps/mob.type";
import { FightEntity } from "../entities/fight-entity";

export class FightFactory {
    create(props: MobType | CharacterPersistence): FightEntity {

    }
}