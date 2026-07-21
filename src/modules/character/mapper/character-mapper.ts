import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { CharacterPersistence } from "../types/character-persistence.type";
import { CharacterEntity } from "../entity/character-entity";
import { CharacterDocument, CharacterModel } from "../schema/character.schema";
import { SkillFactory } from "src/modules/skill/factories/skill.factory";
import { GENERAL_CHARACTER } from "../const/general-character.const";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { Injectable } from "@nestjs/common";
import { CharacterSummary } from "../types/character-summary.type";
import { CharacterSession } from "netim2-shared";

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
            atribute_per_lv: doc.atribute_per_lv,
            beginning: doc.beginning,
            buffos: doc.buffos,
            discovery_world: doc.discovery_world,
            dungeon_in_progress: doc.dungeon_in_progress,
            equipo_1: doc.equipo_1,
            equipo_2: doc.equipo_2,
            equipo_3: doc.equipo_3,
            equipo_options: doc.equipo_options,
            equipo_selected: doc.equipo_selected,
            exp: doc.exp,
            exp_next_lv: doc.exp_next_lv,
            genero: doc.genero,
            lv: doc.lv,
            mission_option: doc.mission_option,
            montura_lv: doc.montura_lv,
            nombre: doc.nombre,
            puntos_atributos: doc.puntos_atributos,
            puntos_habilidad: doc.puntos_habilidad,
            pvp_data: doc.pvp_data,
            raza: doc.raza,
            reino: doc.reino,
            role: doc.role,
            stars_discovery: doc.stars_discovery,
            stats: doc.stats,
            target_type: doc.target_type,
            time_played: doc.time_played,
            timer_boss: doc.timer_boss,
            timer_lv: doc.timer_lv,
            timer_metin: doc.timer_metin,
            timer_mob: doc.timer_mob,
            timer_pvp: doc.timer_pvp,
            type_weapon: doc.type_weapon,
            yang: doc.yang,
            especialidad: doc.especialidad,
            gremio_options: doc.gremio_options,
            montura: doc.montura,
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