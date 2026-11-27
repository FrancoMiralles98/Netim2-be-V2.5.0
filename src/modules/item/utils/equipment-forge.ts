import type { EquipType, EquipmentForgeState } from 'netim2-shared';
import { MAX_EQUIPMENT_FORGE_DURABILITY } from '../config/equipment-forge.config';

/** Completa equipos nuevos o antiguos sin reiniciar su durabilidad persistida. */
export function withEquipmentForge<T extends Omit<EquipType, 'forge'> & { forge?: EquipmentForgeState }>(item: T): T & { forge: EquipmentForgeState } {
    const forge = item.forge;
    const durability = forge?.durability ?? MAX_EQUIPMENT_FORGE_DURABILITY;
    if (!Number.isInteger(durability) || durability < 0 || durability > MAX_EQUIPMENT_FORGE_DURABILITY) {
        throw new Error('Durabilidad de herrería inválida');
    }
    return { ...item, forge: { ...forge, durability } };
}
