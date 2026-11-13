import type { CharacterPersistence } from 'netim2-shared';
import type { MissionEvent } from '../../types/mission-event.types';

/** Convierte los cambios de EXP en hechos de nivel y puntos de atributo ganados. */
export function getExperienceMissionEvents(before: CharacterPersistence, after: CharacterPersistence): MissionEvent[] {
    const events: MissionEvent[] = [];
    for (let level = before.lv + 1; level <= after.lv; level++) {
        events.push({ type: 'action', action: { event: 'character_level_up', level } });
    }
    const points = after.puntos_atributos - before.puntos_atributos;
    if (points > 0) events.push({ type: 'action', action: { event: 'attribute_point_gained' }, quantity: points });
    return events;
}
