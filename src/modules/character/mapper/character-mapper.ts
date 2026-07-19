import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { CharacterPersistence } from "../types/character-persistence.type";
import { CharacterEntity } from "../entity/character-entity";
import { CharacterDocument, CharacterModel } from "../schema/character.schema";
import { SkillFactory } from "src/modules/skill/factories/skill.factory";
import { GENERAL_CHARACTER } from "../const/general-character.const";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { Injectable } from "@nestjs/common";
import { CharacterSummary } from "../types/character-summary.type";

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
    toPersistence(entity: CharacterEntity): CharacterPersistence {
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

/**
 * Convierte un documento de personaje de MongoDB a un resumen seguro para el cliente.
 *
 * Este mapper reduce la información del personaje a los datos necesarios para
 * mostrarlo en la pantalla de selección de personajes.
 *
 *
 * @param character Documento completo del personaje obtenido desde MongoDB.
 * @returns Resumen del personaje preparado para ser enviado al cliente.
 */
    toSummary(character: CharacterDocument): CharacterSummary {
        return {
            id: character._id.toString(),
            nombre: character.nombre,
            raza: character.raza,
            genero: character.genero,
            lv: character.lv,
            reino: character.reino,
            time_played: character.time_played,
            stats: {
                atributos: character.stats.atributos
            },
            especialidad: character.especialidad,
            gremio_options: character.gremio_options

        };
    }
}