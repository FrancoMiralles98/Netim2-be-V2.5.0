import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { CharacterPersistence } from "../types/character-persistence.type";
import { SkillEntity } from "src/modules/skill/entities/skill-base.entity";
import { CharacterEntity } from "../entity/character-entity";

export class CharacterMapper {
    static toDomain(props:CharacterPersistence): CharacterEntity {
        return new CharacterEntity({
            ...props,
            inventario: new Inventory(props.inventario),
            hab: props.hab.map(h=> new SkillEntity(h))
        })
    }

    static toPersistence(character: CharacterEntity): any {
        
    }
}