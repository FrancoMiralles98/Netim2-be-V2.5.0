import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { CharacterPersistence, IdItemList, PreviewForgeUpgradeRequest, ForgeTargetUpgradeLv, ForgeUpgradeLv, ForgeUpgradeConfig, ForgeAttemptModifierConfig, InventoryItem, InventoryChangeResult, PreviewForgeUpgradeWithFailureResponse, ForgeUpgradeActionResult, ForgeUpgradeOutcome, UpgradeForgeItemRequest } from 'netim2-shared';
import { ItemService } from '../../../item/item.service';
import { withEquipmentForge } from '../../../item/utils/equipment-forge';
import { MAX_EQUIPMENT_FORGE_DURABILITY } from '../../../item/config/equipment-forge.config';
import { FORGE_ATTEMPT_MODIFIERS_CONFIG } from '../config/forge-attempt-modifiers.config';
import { ForgeCalculationService } from './forge-calculation.service';
import { FORGE_UPGRADE_CHANCES_CONFIG } from '../config/forge-upgrade-chances.config';
import { FORGE_MATERIAL_REQUIREMENTS } from '../const/forge-material-requirements.const';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import { RngService } from '../../../shared/services/rng.service';

type EquipmentInventoryItem = Extract<InventoryItem, { type: 'equip' }>;

/** Consulta y ejecuta mejoras sobre copias; la persistencia pertenece al orquestador. */
@Injectable()
export class ForgeActionsService {
    constructor(private readonly items: ItemService, private readonly calculation: ForgeCalculationService,
        private readonly rng: RngService) {}

    /** Previsualiza la siguiente mejora de una instancia conservando sus bonus y durabilidad. */
    previewUpgrade(character: CharacterPersistence, request: PreviewForgeUpgradeRequest): PreviewForgeUpgradeWithFailureResponse {
        const saved = character.inventario.find(item => item.id === request.itemId);
        if (!saved) throw new NotFoundException('El ítem no está en el inventario');
        if (saved.type !== 'equip') throw new BadRequestException('Solo se puede mejorar equipo');
        const selected = request.modifierItemId === undefined ? undefined
            : character.inventario.find(item => item.id === request.modifierItemId);
        if (request.modifierItemId !== undefined && !selected) throw new NotFoundException('No tienes el consumible de mejora');
        const modifier = selected ? FORGE_ATTEMPT_MODIFIERS_CONFIG[selected.idItem] : undefined;
        if (selected) {
            if (!modifier || selected.type !== 'utility') throw new BadRequestException('El ítem no es un consumible de herrería');
            if (!Number.isSafeInteger(modifier.quantity) || modifier.quantity < 1) {
                throw new InternalServerErrorException('Cantidad del consumible de herrería inválida');
            }
            if (selected.cantidad < modifier.quantity) throw new BadRequestException('No tienes suficientes consumibles de mejora');
        }
        return this.buildPreview(saved, modifier, selected?.id);
    }

    /** Reutiliza las mismas reglas de costes y probabilidades para consultar y ejecutar. */
    private buildPreview(saved: EquipmentInventoryItem, modifier?: ForgeAttemptModifierConfig,
        modifierItemId?: string): PreviewForgeUpgradeWithFailureResponse {
        if (!Number.isInteger(saved.upgradeLv) || saved.upgradeLv < 0 || saved.upgradeLv >= 9 || saved.upgradeLv >= saved.upgradeMax) {
            throw new BadRequestException('El equipo no admite otra mejora normal');
        }
        const targetUpgradeLv = (saved.upgradeLv + 1) as ForgeTargetUpgradeLv;
        if (modifier) {
            this.calculation.scaleResourceCost(0, modifier.resourceMultiplier?.materials);
            if (!Number.isSafeInteger(modifier.quantity) || modifier.quantity < 1) {
                throw new InternalServerErrorException('Cantidad del consumible de herrería inválida');
            }
            if ((modifier.allowedTargetUpgradeLvs && !modifier.allowedTargetUpgradeLvs.includes(targetUpgradeLv))
                || (modifier.allowedItemIds && !modifier.allowedItemIds.includes(saved.idItem))) {
                throw new BadRequestException('El consumible no es compatible con esta mejora');
            }
        }
        const config = this.getUpgradeConfig(saved.idItem, targetUpgradeLv);
        const current = withEquipmentForge(structuredClone(saved));
        const item = this.items.getUpdatedEquipmentItem({ ...current, upgradeLv: targetUpgradeLv });
        return {
            item, targetUpgradeLv,
            materials: config.materials.map(material => ({
                item: this.items.getItems({ items: [{ idItem: material.idItem }] })[0],
                quantity: this.calculation.scaleResourceCost(material.quantity, modifier?.resourceMultiplier?.materials),
            })).filter(material => material.quantity > 0),
            yangCost: this.calculation.scaleResourceCost(this.calculation.getYangCost(item.lvReq, targetUpgradeLv), modifier?.resourceMultiplier?.yang),
            baseSuccessChance: config.successChance,
            upgradeLvAfterProtectedFailure: this.calculation.getUpgradeLvAfterProtectedFailure(saved.upgradeLv as ForgeUpgradeLv, modifier),
            chances: this.calculation.getChances(config.successChance, current.forge.durability, modifier),
            durability: {
                current: current.forge.durability, max: MAX_EQUIPMENT_FORGE_DURABILITY,
                afterDurabilityLoss: Math.max(0, current.forge.durability - 1),
                afterProtectedFailure: current.forge.durability,
            },
            ...(modifierItemId && modifier ? { modifier: { itemId: modifierItemId, quantity: modifier.quantity } } : {}),
        };
    }

    /** Valida recursos completos antes de sortear y devuelve inventario y yang finales. */
    upgradeItem(character: CharacterPersistence, request: UpgradeForgeItemRequest): ForgeUpgradeActionResult {
        const saved = character.inventario.find(item => item.id === request.itemId);
        if (!saved) throw new NotFoundException('El ítem no está en el inventario');
        if (saved.type !== 'equip') throw new BadRequestException('Solo se puede mejorar equipo');
        const modifier = request.modifierIdItem === undefined ? undefined : FORGE_ATTEMPT_MODIFIERS_CONFIG[request.modifierIdItem];
        if (request.modifierIdItem !== undefined && (!Number.isSafeInteger(request.modifierIdItem) || !modifier)) {
            throw new BadRequestException('El bonificador de herrería no es válido');
        }
        const preview = this.buildPreview(saved, modifier);
        if (!Number.isSafeInteger(character.yang) || character.yang < preview.yangCost) {
            throw new BadRequestException('No tienes suficiente yang para mejorar');
        }
        const requirements = new Map<IdItemList, number>(preview.materials.map(material => [material.item.idItem, material.quantity]));
        if (modifier && request.modifierIdItem !== undefined) {
            const total = (requirements.get(request.modifierIdItem) ?? 0) + modifier.quantity;
            if (!Number.isSafeInteger(total)) throw new InternalServerErrorException('Cantidad requerida fuera de rango');
            requirements.set(request.modifierIdItem, total);
            const [base] = this.items.getItems({ items: [{ idItem: request.modifierIdItem }] });
            if (base.type !== 'utility') throw new InternalServerErrorException('El bonificador debe ser un consumible');
        }
        const plan = this.planConsumption(character.inventario, saved.id, requirements);
        const inventory = new Inventory(structuredClone(character.inventario));
        for (const entry of plan) inventory.removeItemById(entry.id, entry.quantity);
        const current = withEquipmentForge(structuredClone(saved));
        const outcome = this.rollOutcome(preview);
        let item: EquipmentInventoryItem | null = null;
        if (outcome === 'destroyed') {
            inventory.removeItemById(saved.id);
        } else {
            if (outcome === 'success') current.upgradeLv = preview.targetUpgradeLv;
            else if (outcome === 'durability_loss') current.forge.durability--;
            else current.upgradeLv = preview.upgradeLvAfterProtectedFailure;
            item = this.items.getUpdatedEquipmentItem(current);
        }
        const inventario = inventory.getInventory().map(entry => entry.id === saved.id && item ? item : entry);
        const yang = character.yang - preview.yangCost;
        const updatedItems = this.getInventoryChanges(character.inventario, inventario);
        // Si el bonificador no admite el siguiente destino, se muestra la mejora sin él.
        const nextModifier = item && modifier?.allowedTargetUpgradeLvs
            && !modifier.allowedTargetUpgradeLvs.includes((item.upgradeLv + 1) as ForgeTargetUpgradeLv) ? undefined : modifier;
        const nextPreview = item && item.upgradeLv < Math.min(9, item.upgradeMax) ? this.buildPreview(item, nextModifier) : null;
        return { changes: { inventario, yang }, response: { outcome, item, updatedItems, yang, nextPreview } };
    }

    /** Resuelve primero el éxito y, solo sin protección, sortea el tipo de fallo. */
    private rollOutcome(preview: PreviewForgeUpgradeWithFailureResponse): ForgeUpgradeOutcome {
        if (this.rng.randomNumberInRange(0, 100, true) < preview.chances.success) return 'success';
        if (preview.chances.protectedFailure > 0) {
            return preview.upgradeLvAfterProtectedFailure < preview.targetUpgradeLv - 1 ? 'downgraded' : 'protected_failure';
        }
        const failureWeight = preview.chances.destruction + preview.chances.durabilityLoss;
        return this.rng.randomNumberInRange(0, failureWeight, true) < preview.chances.durabilityLoss ? 'durability_loss' : 'destroyed';
    }

    /** Reserva consumos por instancia, sumando materiales y bonificador y excluyendo el equipo objetivo. */
    private planConsumption(inventory: InventoryItem[], targetId: string, requirements: Map<IdItemList, number>): { id: string; quantity?: number }[] {
        const plan: { id: string; quantity?: number }[] = [];
        for (const [idItem, quantity] of requirements) {
            let remaining = quantity;
            for (const item of inventory) {
                if (remaining === 0) break;
                if (item.id === targetId || item.idItem !== idItem) continue;
                const available = item.type === 'utility' ? item.cantidad : 1;
                if (!Number.isSafeInteger(available) || available < 1) throw new BadRequestException('Cantidad de inventario inválida');
                const consumed = Math.min(remaining, available);
                plan.push({ id: item.id, quantity: item.type === 'utility' ? consumed : undefined });
                remaining -= consumed;
            }
            if (remaining > 0) throw new BadRequestException(`No tienes suficientes unidades del material o bonificador ${idItem}`);
        }
        return plan;
    }

    /** Devuelve cantidades finales y bajas; el equipo conservado viaja completo en item. */
    private getInventoryChanges(before: InventoryItem[], after: InventoryItem[]): InventoryChangeResult[] {
        const remaining = new Map(after.map(item => [item.id, item]));
        return before.flatMap(item => {
            const updated = remaining.get(item.id);
            if (!updated) return [{ id: item.id }];
            if (item.type === 'utility' && updated.type === 'utility' && item.cantidad !== updated.cantidad) {
                return [{ id: item.id, cantidad: updated.cantidad }];
            }
            return [];
        });
    }

    /** Obtiene las reglas de mejora; sin requisitos configurados, no exige materiales. */
    getUpgradeConfig(idItem: IdItemList, targetUpgradeLv: ForgeTargetUpgradeLv): ForgeUpgradeConfig {
        if (!Number.isSafeInteger(idItem) || !Number.isSafeInteger(targetUpgradeLv) || targetUpgradeLv < 1 || targetUpgradeLv > 9) {
            throw new BadRequestException('El ítem y el nivel de destino deben ser válidos; el herrero admite +1 a +9');
        }
        const groups = FORGE_MATERIAL_REQUIREMENTS.filter(group => group.idItems.includes(idItem));
        if (groups.length > 1) throw new InternalServerErrorException('El ítem pertenece a varios grupos de mejora');
        const materials = groups[0]?.requirementsByUpgrade[targetUpgradeLv] ?? [];
        const successChance = FORGE_UPGRADE_CHANCES_CONFIG[targetUpgradeLv];
        if (!Number.isFinite(successChance) || successChance < 0 || successChance > 100) {
            throw new InternalServerErrorException('Probabilidad de mejora inválida');
        }
        const seen = new Set<IdItemList>();
        for (const material of materials) {
            if (!Number.isSafeInteger(material.idItem) || !Number.isSafeInteger(material.quantity) || material.quantity < 1 || seen.has(material.idItem)) {
                throw new InternalServerErrorException('Los materiales deben ser únicos y sus cantidades enteras positivas');
            }
            seen.add(material.idItem);
        }
        return { idItem, targetUpgradeLv, successChance, materials: structuredClone([...materials]) };
    }
}
