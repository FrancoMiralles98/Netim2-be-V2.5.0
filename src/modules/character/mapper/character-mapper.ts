import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { CharacterPersistence } from "../types/character-persistence.type";
import { CharacterEntity } from "../entity/character-entity";
import { CharacterModel } from "../schema/character.schema";
import { SkillFactory } from "src/modules/skill/factories/skill.factory";

export class CharacterMapper {

    static fromDb(doc: CharacterModel): CharacterPersistence {
        return {
            ...doc,
            hab: doc.hab ?? [],
            inventario: doc.inventario ?? [],
            historial: [],
            party: []
        };
    }


    static toDomain(props: CharacterPersistence): CharacterEntity {
        return new CharacterEntity({
            ...props,
            inventario: new Inventory(props.inventario),
            hab: props.hab.map(h => SkillFactory.create(h))
        })
    }


    static toPersistence(entity:CharacterEntity): CharacterPersistence {
        return entity.toPrimitives()
    }
}