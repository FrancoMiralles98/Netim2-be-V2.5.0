import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { CharacterPersistence } from "../types/character-persistence.type";
import { CharacterEntity } from "../entity/character-entity";
import { CharacterModel } from "../schema/character.schema";
import { SkillFactory } from "src/modules/skill/factories/skill.factory";
import { GENERAL_CHARACTER } from "../const/general-character.const";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { Injectable } from "@nestjs/common";

/**
 * Mapper encargado de transformar datos entre las distintas capas:
 *
 * DB (Mongo) → Persistence → Domain → Persistence
 */
@Injectable()
export class CharacterMapper {

   /**
   * Convierte un documento de MongoDB a `CharacterPersistence`.
   *
   * Normaliza datos que pueden no existir en la base de datos
   * y asegura una estructura consistente para la capa de aplicación.
   */
    fromDb(doc: CharacterModel): CharacterPersistence {
        return {
            ...doc,
            hab: doc.hab ?? [],
            inventario: doc.inventario ?? [],
            historial: [],
            party: []
        };
    }


    /**
   * Convierte datos de `CharacterPersistence` a `CharacterEntity`.
   *
   * Reconstruye las sub-entidades necesarias:
   * - Inventory → entidad con lógica de inventario
   * - Skills → entidades específicas
   */
    toDomain(props: CharacterPersistence): CharacterEntity {
        return new CharacterEntity({
            ...props,
            inventario: new Inventory(props.inventario),
            hab: props.hab.map(h => SkillFactory.create(h))
        })
    }


   /**
   * Convierte una entidad de dominio 
   * a datos planos listos para persistir en la base de datos
   */
    toPersistence(entity:CharacterEntity): CharacterPersistence {
        return entity.toPrimitives()
    }

    /**
     * convierte los datos que se pasa del cliente para la creacion del personaje para poder despues guardarlo en la db
     */
    createCharacterToPersistence(props: CreateCharacterDto): CharacterPersistence {
        const baseCharacterCopy = structuredClone(GENERAL_CHARACTER)
        baseCharacterCopy.nombre = props.nombre!
        baseCharacterCopy.genero = props.genero!
        baseCharacterCopy.raza = props.raza!
        baseCharacterCopy.reino = props.reino!

        return baseCharacterCopy 
    }
}