import { Injectable } from "@nestjs/common";
import { EquipmentItemDropService } from "./equipment-item-drop.service";
import { ItemDTO } from "src/modules/item/types/item-dto";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { DROP_TAG_CHANCES_BY_DIFFICULTY } from "../config/drop-tag-chance-by-difficulty.config";
import { RngService } from "src/modules/shared/services/rng.service";
import { MicsBonusService } from "./miscs-bonus.service";
import { DropTag, ItemSource } from "src/modules/item/types/entities-props/item-drop.config.type";
import { itemsList } from "src/modules/item/const/items.const";
import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type";
import { UtilityItemDropService } from "./utility-item-drop.service";
import { DROP_WEIGHT } from "../config/drop-weight.config";
import { DropWeightType } from "../types/drop-weight.type";

@Injectable()
export class ItemDropService {
    constructor(
        private equipmentItemDropService: EquipmentItemDropService,
        private utilityItemDropService: UtilityItemDropService,
        private rngService: RngService,
        private miscsBonusService: MicsBonusService,
    ) { }

    dropItem(
        mob: MobModel,
        bonus: CharacterStats['bonus']['miscs']
    ): ItemDTO {
        let mobDropTags = structuredClone(DROP_TAG_CHANCES_BY_DIFFICULTY[mob.enemie_type])

        const applyBonus = this.rngService.rollChance(bonus.chances_raros)

        if (applyBonus) {
            mobDropTags = this.miscsBonusService.applyRareDropTagBonus(mobDropTags)
        }

        const tagSelected = this.rngService.pickWeightedResult(mobDropTags)

        const item = this.getItem(tagSelected,mob)

    }

    /**
    * Selecciona un ítem aleatorio dentro del pool disponible para un tag de drop.
    *
    * Flujo:
    * - Obtiene todos los ítems válidos para el tag y el mob recibido.
    * - Convierte el weight de cada ítem a un valor numérico.
    * - Realiza una selección ponderada según dichos weights.
    * - Busca el ítem correspondiente al resultado obtenido.
    * - Retorna una copia del ítem seleccionado.
    *
    * @param tag Tag de drop seleccionado previamente.
    * @param mob Mob que está generando el drop.
    *
    * @returns Copia del ítem seleccionado.
    */
    private getItem(
        tag: DropTag,
        mob: MobModel,
    ): ItemDTO {
        const filterList = this.getFilterList(tag, mob)

        if (filterList.length === 0) {
            throw new Error(`No hay items disponibles para el tag ${tag}`)
        }

        const weightedItems = Object.fromEntries(
            filterList.map(item => [
                String(item.idItem),
                this.resolveDropWeight(item.itemDropConfig!.weight),
            ])
        )

        const selectedId = Number(this.rngService.pickWeightedResult(weightedItems))

        const selectedItem = filterList.find(item => item.idItem === selectedId)

        if (!selectedItem) {
            throw new Error(`No se pudo seleccionar item para el tag ${tag}`)
        }

        return structuredClone(selectedItem)
    }


    /**
    * Obtiene la lista de ítems válidos para un tag de drop
    * teniendo en cuenta el mob que los genera.
    *
    * Reglas:
    * - Si el tag es `mob_specific`, utiliza únicamente los drops
    *   específicos configurados en el mob.
    * - Para el resto de tags:
    *   - El ítem debe poseer configuración de drop.
    *   - Debe contener el tag solicitado.
    *   - El nivel del mob debe estar dentro del rango permitido.
    *   - El source del ítem debe coincidir con el tipo de enemigo.
    *
    * @param tag Tag de drop que se desea buscar.
    * @param mob Mob que está generando el drop.
    *
    * @returns Lista de ítems candidatos para el drop.
    *
    * @throws Error Si un ítem configurado en `specific_drop`
    * no existe en la lista global de ítems.
    */
    private getFilterList(
        tag: DropTag,
        mob: MobModel,
    ): ItemDTO[] {
        if (tag === 'mob_specific') {

            const specific_items: ItemDTO[] = []

            for (const idItem of mob.specific_drop) {
                const fullItem = itemsList.find(i => i.idItem === idItem)

                if (!fullItem) {
                    throw new Error(`No se encuentra le item idItem: ${idItem}`)
                }

                specific_items.push(fullItem)
            }
            return specific_items
        }

        const source = this.getDropSource(mob.enemie_type)

        const filterList = itemsList.filter(item => {
            if (!item.itemDropConfig) {
                return false
            }

            if (!item.itemDropConfig.drop_tag.includes(tag)) {
                return false
            }

            if (mob.lv < item.itemDropConfig.mobLv.min || mob.lv > item.itemDropConfig.mobLv.max) {
                return false
            }

            if (!item.itemDropConfig.source.includes(source)) {
                return false
            }

            return true
        })
        return filterList
    }

    /**
    * Obtiene el source de drop correspondiente según
    * el tipo de enemigo.
    *
    * Este valor se utiliza para filtrar qué ítems pueden
    * ser obtenidos por cada categoría de enemigo.
    *
    * Ejemplos:
    * - mob -> mob_drop
    * - netim -> netim_drop
    * - boss -> boss_drop
    * - raid -> raid_drop
    *
    * @param type Tipo de enemigo.
    *
    * @returns Source de drop asociado.
    */
    private getDropSource(type: EnemyType): ItemSource {
        const sourceByType: Record<EnemyType, ItemSource> = {
            mob: 'mob_drop',
            netim: 'netim_drop',
            boss: 'boss_drop',
            raid: 'raid_drop',
        }

        return sourceByType[type]
    }

    /**
    * Resuelve el weight real de un ítem para ser utilizado
    * en las selecciones ponderadas de drop
    *
    * Ejemplos:
    * - 150 -> 150
    * - 'COMMON' -> DROP_WEIGHT.COMMON
    * - 'RARE' -> DROP_WEIGHT.RARE
    *
    * @param weight Weight configurado en el ítem.
    *
    * @returns Valor numérico final del weight.
    */
    private resolveDropWeight(weight: number | DropWeightType): number {
        return typeof weight === 'number'
            ? weight
            : DROP_WEIGHT[weight]
    }
}