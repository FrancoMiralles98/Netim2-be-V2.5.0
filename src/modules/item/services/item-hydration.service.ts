import { Injectable } from "@nestjs/common";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { isEquipItem, isPiedraItem, isUtilityItem } from "../types/item-type-guard.type";
import { EquipType } from "../types/entities-props/equip.type";
import { ItemDTO, UtilityItemDTO } from "../types/item-dto";
import { PiedraType } from "../types/entities-props/piedra.type";
import { CañaType } from "../types/entities-props/caña.type";
import { MonturaType } from "../types/entities-props/montura.type";

/**
 * Servicio encargado de rehidratar ítems persistidos en inventario
 * utilizando la información más reciente definida en las configuraciones
 * base del juego.
 *
 * Su objetivo es mantener actualizados los datos estáticos de los ítems
 * (nombre, imagen, restricciones, slots, etc.) sin perder el estado
 * dinámico almacenado por el jugador.
 */
@Injectable()
export class ItemHydrationService {

    /**
     * Rehidrata un ítem persistido utilizando la información base
     * más reciente disponible en la configuración del juego.
     *
     * Dependiendo del tipo de ítem se ejecutará el proceso de merge
     * correspondiente para conservar únicamente el estado dinámico
     * que pertenece al jugador.
     *
     * @param baseItem Información base actual del ítem.
     * @param savedItem Ítem almacenado en inventario.
     *
     * @returns Ítem actualizado conservando el estado persistente.
     */
    hydrateInventoryItem(baseItem: ItemDTO, savedItem: InventoryItem): InventoryItem {
        const commonState = {
            id: savedItem.id,
            position: savedItem.position,
        }

        if (isEquipItem(savedItem)) {
            return {
                ...this.mergeEquipItem(baseItem, savedItem),
                ...commonState
            }
        }

        if (!isUtilityItem(baseItem)) {
            throw new Error(`el item ${baseItem.idItem} no es tipo utility`)
        }

        switch (savedItem.type_utility) {
            case 'piedra':
                return {
                    ...this.mergePiedraItem(baseItem, savedItem),
                    ...commonState
                }
            case 'buff':
            case 'cebo':
            case 'utility':
            case 'poción':
                return {
                    ...this.mergeGenericUtilityItem(baseItem, savedItem),
                    ...commonState
                }
            case 'caña':
                return {
                    ...this.mergeCañaItem(baseItem, savedItem),
                    ...commonState
                }
            case 'montura':
                return {
                    ...this.mergeMonturaItem(baseItem, savedItem),
                    ...commonState
                }
            default:
                throw new Error(`No se encuentra el tipo de utilidad para hidratar`)
        }
    }

    private mergeEquipItem(baseItem: ItemDTO, savedItem: EquipType): EquipType {
        if (!isEquipItem(baseItem)) {
            throw new Error(`el item ${baseItem.idItem} no es tipo equip`)
        }
        const mergedItem: EquipType = {
            ...baseItem,
            explicitBonus: savedItem.explicitBonus,
            bonus6_7: savedItem.bonus6_7,
            corrupt: savedItem.corrupt,
            corruptExplicitBonus: savedItem.corruptExplicitBonus,
            corruptImplicitBonus: savedItem.corruptImplicitBonus,
            corruptSpecialBonus: savedItem.corruptSpecialBonus,
            itemLv: savedItem.itemLv,
            piedras: savedItem.piedras,
            upgradeLv: savedItem.upgradeLv,
            weight: savedItem.weight
        }

        return mergedItem
    }

    private mergePiedraItem(baseItem: ItemDTO, savedItem: PiedraType): PiedraType {
        if (!isPiedraItem(baseItem)) {
            throw new Error(`el item ${baseItem.idItem} no es tipo piedra`)
        }
        const mergedItem: PiedraType = {
            ...baseItem,
            specialCorruptBonus: savedItem.specialCorruptBonus,
            corrupt: savedItem.corrupt,
            implicitBonus: savedItem.implicitBonus,
            upgradeLv: savedItem.upgradeLv,
        }

       return mergedItem
    }

    private mergeMonturaItem(baseItem: UtilityItemDTO, savedItem: MonturaType): MonturaType {
        if (baseItem.type_utility !== 'montura') {
            throw new Error(`el item debe ser tipo montura y es tipo ${baseItem.type_utility}`)
        }

        const mergedItem: MonturaType = {
            ...baseItem,
            montura: {
                ...savedItem.montura,
                idItemRef: baseItem.montura.idItemRef,
                idItemFood: baseItem.montura.idItemFood,
                idItemRevive: baseItem.montura.idItemRevive,
                maxLv: baseItem.montura.maxLv,
                name: baseItem.montura.name,
                img: baseItem.montura.img,
            },
            corrupt: savedItem.corrupt,
        }

        return mergedItem
    }

    private mergeCañaItem(baseItem: UtilityItemDTO, savedItem: CañaType): CañaType {

        if (baseItem.type_utility !== 'caña') {
            throw new Error(`el item debe ser tipo caña y es tipo ${baseItem.type_utility}`)
        }

        const mergedItem: CañaType = {
            ...baseItem,
            exp: savedItem.exp,
            expOfLv: savedItem.expOfLv,
            upgradeLv: savedItem.upgradeLv,
            corrupt: savedItem.corrupt,
            pescaSkill: savedItem.pescaSkill,
        }

        return mergedItem
    }

    private mergeGenericUtilityItem(baseItem: UtilityItemDTO, savedItem: UtilityItemDTO): UtilityItemDTO {

        const mergedItem: UtilityItemDTO = {
            ...baseItem,
            cantidad: savedItem.cantidad,
        }

        return mergedItem
    }
}