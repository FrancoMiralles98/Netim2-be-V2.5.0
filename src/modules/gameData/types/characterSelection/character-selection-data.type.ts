import { RaceInfo } from "./race-info.types";
import { CharacterSummary } from "src/modules/character/types/character-summary.type";

/**
 * Datos necesarios para inicializar la pantalla de selección de personaje.
 *
 * Esta estructura se envía al cliente desde la ruta de selección de personaje
 * e incluye tanto los personajes disponibles de la cuenta como la información
 * necesaria para crear un nuevo personaje.
 *
 * @property characters Lista resumida de personajes pertenecientes a la cuenta autenticada.
 * @property races Información de las razas disponibles para la creación de personaje.
 * @property attributeLimit Límite máximo total que puede alcanzar un atributo, incluyendo puntos base y bonus externos.
 */
export interface CharacterSelectionDataType {
    characters: CharacterSummary[]
    races: RaceInfo[];
    attributeLimit: number;
}