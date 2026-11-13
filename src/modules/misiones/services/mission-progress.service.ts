import { Injectable } from '@nestjs/common';
import { getMissionStatus, getUnlockedMissionObjectives } from 'netim2-shared';
import type {
    CharacterPersistence, IdItemList, InventoryItem, MissionDefinition, MissionObjective,
    MissionOption, MissionProgress, MissionStatus,
} from 'netim2-shared';
import { isDeepStrictEqual } from 'node:util';
import { MISSIONS_BY_ID } from '../const';
import type { MissionEvent } from '../types/mission-event.types';

type MissionCharacter = Pick<CharacterPersistence, 'mission_option' | 'inventario' | 'lv' | 'especialidad'>;

/** Evalúa objetivos, pasos y vencimientos con el estado del personaje. */
@Injectable()
export class MissionProgressService {
    /** Aplica hechos del servidor y devuelve el estado nuevo únicamente si cambió. */
    register(character: MissionCharacter, events: readonly MissionEvent[], now = new Date()): MissionOption | undefined {
        if (!character.mission_option?.missionsInProgress.length) return undefined;
        const missionsInProgress = character.mission_option.missionsInProgress.map(progress => {
            const definition = MISSIONS_BY_ID.get(progress.missionId);
            if (!definition || character.mission_option.idMissionsDone.includes(progress.missionId)) return progress;
            return this.advance(definition, progress, character.inventario, now, events);
        });
        if (isDeepStrictEqual(missionsInProgress, character.mission_option.missionsInProgress)) return undefined;
        return { ...character.mission_option, missionsInProgress };
    }

    /** Registra los hechos para el paso habilitado y avanza por los pasos ya satisfechos. */
    advance(definition: MissionDefinition, progress: MissionProgress, inventory: InventoryItem[],
        now: Date, events: readonly MissionEvent[] = []): MissionProgress {
        if (progress.completedAt || (progress.expiresAt && now >= progress.expiresAt)) return progress;
        const counts = new Map(progress.objectivesProgress.map(({ objectiveId, count }) => [objectiveId, count]));
        for (const event of events) {
            for (const objective of getUnlockedMissionObjectives(definition, progress)) {
                const quantity = this.eventQuantity(objective, event);
                if (quantity === 0) continue;
                counts.set(objective.id, Math.min(objective.quantity, (counts.get(objective.id) ?? 0) + quantity));
            }
            // Un hecho puede habilitar el siguiente paso, pero se contabiliza en el que estaba activo.
            progress = this.advanceSteps(definition, { ...progress,
                objectivesProgress: this.toProgress(counts) }, counts, inventory, now);
            if (progress.completedAt) break;
        }
        return this.advanceSteps(definition, progress, counts, inventory, now);
    }

    /** Determina si se puede cobrar, incluyendo los ítems que deben seguir disponibles. */
    status(definition: MissionDefinition, character: MissionCharacter, now: Date): MissionStatus | null {
        const status = getMissionStatus(definition, character, now);
        if (status !== 'ready_to_claim') return status;
        return this.hasClaimItems(definition, character.inventario) ? status : 'in_progress';
    }

    /** Obtiene el contador visible, consultando el inventario para objetivos de posesión. */
    objectiveCount(objective: MissionObjective, progress: MissionProgress, inventory: InventoryItem[]): number {
        if (objective.type === 'collect' && objective.mode === 'inventory') {
            return Math.min(objective.quantity, this.inventoryCount(inventory, objective.itemId));
        }
        return progress.objectivesProgress.find(entry => entry.objectiveId === objective.id)?.count ?? 0;
    }

    /** Suma las unidades a entregar, incluyendo objetivos distintos del mismo ítem. */
    requiredDeliveries(definition: MissionDefinition): Map<IdItemList, number> {
        const deliveries = new Map<IdItemList, number>();
        for (const { objectives } of definition.steps) {
            for (const objective of objectives) {
                if (objective.type !== 'collect' || objective.mode !== 'inventory' || !objective.consumeOnClaim) continue;
                deliveries.set(objective.itemId, (deliveries.get(objective.itemId) ?? 0) + objective.quantity);
            }
        }
        return deliveries;
    }

    /** Cuenta instancias y unidades de un ítem en el inventario. */
    private inventoryCount(inventory: InventoryItem[], itemId: IdItemList): number {
        return inventory.reduce((count, item) =>
            item.idItem === itemId ? count + (item.type === 'utility' ? item.cantidad : 1) : count, 0);
    }

    /** Verifica posesión y las cantidades totales que se consumen en la entrega. */
    private hasClaimItems(definition: MissionDefinition, inventory: InventoryItem[]): boolean {
        return [...this.requiredDeliveries(definition)].every(([itemId, quantity]) =>
            this.inventoryCount(inventory, itemId) >= quantity) &&
            definition.steps.every(step => step.objectives.every(objective =>
                objective.type !== 'collect' || objective.mode !== 'inventory' ||
                this.inventoryCount(inventory, objective.itemId) >= objective.quantity));
    }

    /** Desbloquea los pasos que ya cumplen sus objetivos y registra la finalización. */
    private advanceSteps(definition: MissionDefinition, progress: MissionProgress, counts: Map<number, number>,
        inventory: InventoryItem[], now: Date): MissionProgress {
        if (progress.completedAt) return progress;
        while (getUnlockedMissionObjectives(definition, progress).every(objective =>
            (objective.type === 'collect' && objective.mode === 'inventory'
                ? this.inventoryCount(inventory, objective.itemId) : counts.get(objective.id) ?? 0) >= objective.quantity)) {
            const index = definition.steps.findIndex(step => step.id === progress.activeStepId);
            const next = definition.sequentialSteps ? definition.steps[index + 1] : undefined;
            if (!next) {
                if (this.hasClaimItems(definition, inventory)) return { ...progress, completedAt: now };
                break;
            }
            progress = { ...progress, activeStepId: next.id };
        }
        return progress;
    }

    /** Devuelve la cantidad que aporta un hecho a un objetivo compatible. */
    private eventQuantity(objective: MissionObjective, event: MissionEvent): number {
        const quantity = event.quantity ?? 1;
        if (!Number.isSafeInteger(quantity) || quantity < 1) return 0;
        if (objective.type === 'hunt' && event.type === 'hunt') {
            const { target } = objective;
            if (target.zone !== undefined && target.zone !== event.zone) return 0;
            if ('mobIds' in target && !target.mobIds.includes(event.mobId)) return 0;
            if ('enemyType' in target && target.enemyType !== event.enemyType) return 0;
            return quantity;
        }
        if (objective.type === 'collect' && objective.mode === 'obtained' && event.type === 'collect') {
            return objective.itemId === event.itemId ? quantity : 0;
        }
        if (objective.type === 'action' && event.type === 'action') {
            const fields = new Map(Object.entries(event.action));
            const matches = Object.entries(objective.action).every(([key, value]) =>
                value === undefined || (key === 'minLevel'
                    ? typeof value === 'number' && (event.action.level ?? 0) >= value
                    : fields.get(key) === value));
            return matches ? quantity : 0;
        }
        return 0;
    }

    /** Serializa los contadores acumulados por objetivo. */
    private toProgress(counts: Map<number, number>): MissionProgress['objectivesProgress'] {
        return [...counts].map(([objectiveId, count]) => ({ objectiveId, count }));
    }
}
