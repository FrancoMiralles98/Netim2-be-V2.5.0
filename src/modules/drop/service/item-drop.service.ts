import { Injectable } from "@nestjs/common";
import { EquipItemDropService } from "./equipment-item-drop.service";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { DROP_TAG_CHANCES_BY_DIFFICULTY } from "../config/drop/drop-tag-chance-by-difficulty.config";
import { RngService } from "src/modules/shared/services/rng.service";
import { MicsBonusService } from "./miscs-bonus.service";
import { ITEM_LIST } from "src/modules/item/const/items.const";
import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type";
import { UtilityItemDropService } from "./utility-item-drop.service";
import { DROP_WEIGHT } from "../config/drop/drop-weight.config";
import { RARE_DROP_MULTIPLIER } from "../config/drop/rare-drop-bonus-multiplier.config";
import { isEquipItem } from "src/modules/item/types/item-type-guard.type";
import { EQUIP_DROP_LV_WEIGHT_CONFIG } from "../config/equip/equip-drop-lv.config";
import { ItemService } from "src/modules/item/item.service";
import { DropTag, EquipType, IdItemList, ItemDTO, ItemSource, Stats } from "netim2-shared";
import { DropWeightType } from "netim2-shared/dist/drop/drop-weight.type";

@Injectable()
export class ItemDropService {
    constructor(
        private equipItemDropService: EquipItemDropService,
        private utilityItemDropService: UtilityItemDropService,
        private rngService: RngService,
        private miscsBonusService: MicsBonusService,
        private itemService: ItemService,
    ) { }

    /**
    * Genera un ítem obtenido mediante el sistema de drops de un enemigo.
    *
    * El proceso selecciona primero una categoría de drop (tag) utilizando
    * las probabilidades configuradas para el tipo de enemigo y aplicando
    * los modificadores de rareza del personaje.
    *
    * Si la categoría no tiene candidatos, se quita de esta tirada y se sortea
    * de nuevo con los pesos restantes. Al agotar las categorías, devuelve null.
    *
    * Con una categoría válida, genera el ítem según su tipo:
    * - Equipos: generación de implícitos, explícitos y calidad.
    * - Utilidades: actualmente la cantidad que se le otorgara.
    *
    * @param mob Enemigo responsable del drop.
    * @param bonus Bonus misceláneos del personaje que afectan la generación
    * de drops y las probabilidades de rareza.
    *
    * @returns Ítem generado, o null si ninguna categoría con peso positivo tiene candidatos.
    */
    dropItem(
        mob: MobModel,
        bonus: Stats['bonus']['miscs']
    ): ItemDTO | null {
        const remainingTags = this.getCategoryWeights(mob, bonus.chances_raros)

        while (Object.values(remainingTags).some(weight => weight > 0)) {
            const tag = this.rngService.pickWeightedResult(remainingTags)
            const weights = this.getCandidateWeights(tag, mob, bonus.chances_raros)
            if (Object.keys(weights).length === 0) {
                delete remainingTags[tag]
                continue
            }

            const itemId = Number(this.rngService.pickWeightedResult(weights)) as IdItemList
            const baseItem = this.itemService.getCoreItemInfoByIdItem(itemId)
            if (isEquipItem(baseItem)) {
                return this.equipItemDropService.generateFinalItem(baseItem, mob, bonus.chances_raros)
            }

            return this.utilityItemDropService.generateFinalItem(baseItem, mob, bonus.chances_raros)
        }

        return null
    }

    /** Calcula la probabilidad de cada ítem dado que el intento cayó en un drop de ítem. */
    getItemProbabilities(mob: MobModel, rareBonusValue: number): Map<IdItemList, number> {
        const categoryWeights = this.getCategoryWeights(mob, rareBonusValue)
        const categories: { weight: number; candidates: [string, number][] }[] = []
        let totalCategoryWeight = 0
        for (const [tag, weight] of Object.entries(categoryWeights) as [DropTag, number][]) {
            const candidates = Object.entries(this.getCandidateWeights(tag, mob, rareBonusValue))
            if (!candidates.length) continue

            totalCategoryWeight += weight
            categories.push({ weight, candidates })
        }

        const probabilities = new Map<IdItemList, number>()
        for (const { weight, candidates } of categories) {
            const totalItemWeight = candidates.reduce((total, [, itemWeight]) => total + itemWeight, 0)
            const categoryProbability = weight / totalCategoryWeight
            for (const [id, itemWeight] of candidates) {
                const itemId = Number(id) as IdItemList
                const probability = categoryProbability * itemWeight / totalItemWeight
                probabilities.set(itemId, (probabilities.get(itemId) ?? 0) + probability)
            }
        }
        return probabilities
    }

    /** Obtiene los pesos de categorías que pueden salir con el bonus de rareza actual. */
    private getCategoryWeights(mob: MobModel, rareBonusValue: number): Partial<Record<DropTag, number>> {
        const weights = this.miscsBonusService.applyRareDropTagBonus(
            DROP_TAG_CHANCES_BY_DIFFICULTY[mob.enemie_type],
            rareBonusValue,
        )
        return Object.fromEntries(Object.entries(weights).filter(([, weight]) => weight > 0))
    }

    /** Pondera por rareza y nivel los ítems elegibles de una categoría. */
    private getCandidateWeights(tag: DropTag, mob: MobModel, rareBonusValue: number): Record<string, number> {
        const weights: Record<string, number> = {}
        for (const item of this.getFilterList(tag, mob)) {
            const config = item.itemDropConfig
            if (!config) throw new Error(`El ítem ${item.idItem} del tag ${tag} no tiene configuración de drop`)
            const weight = this.resolveDropWeight(config.weight, rareBonusValue, item, mob)
            if (weight > 0) weights[item.idItem] = weight
        }
        return weights
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
                const fullItem = ITEM_LIST.find(i => i.idItem === idItem)

                if (!fullItem) {
                    throw new Error(`No se encuentra le item idItem: ${idItem}`)
                }

                specific_items.push(fullItem)
            }
            return specific_items
        }

        const source = this.getDropSource(mob.enemie_type)

        const filterList = ITEM_LIST.filter(item => {
            //No puede dropear si el item no tiene la configuracion de drop
            if (!item.itemDropConfig) {
                return false
            }

            if (isEquipItem(item)) {
                // No puede dropear equipamiento de nivel superior al mob
                if (item.lvReq > mob.lv) {
                    return false
                }

                // No puede dropear equipamiento demasiado inferior
                if (item.lvReq < mob.lv - EQUIP_DROP_LV_WEIGHT_CONFIG.maxLevelDifference) {
                    return false
                }
            }

            //No puede dropear los items que no tengan el mismo tag
            if (!item.itemDropConfig.drop_tag.includes(tag)) {
                return false
            }

            //no puede dropear si no esta en la franja de niveles que el item puede dropearse
            if (mob.lv < item.itemDropConfig.mobLv.min || mob.lv > item.itemDropConfig.mobLv.max) {
                return false
            }

            //no puede dropearse si la fuente en donde aparece no coincide
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
    * Resuelve el weight final de un ítem dentro del pool de drops.
    *
    * Aplica:
    * - Weight base configurado por rareza.
    * - Bonus de frecuencia de objetos raros.
    * - Multiplicador por diferencia de nivel en equipamiento.
    *
    * El bonus de rareza aumenta progresivamente el peso de los drops
    * afectados según `RARE_DROP_MULTIPLIER`.
    *
    * @param weight Rareza base usada para obtener el weight inicial.
    * @param rareBonusValue Valor de frecuencia de objetos raros del personaje.
    * @param item Ítem candidato del pool de drops.
    * @param mob Mob que genera el drop.
    *
    * @returns Weight final redondeado para la selección ponderada.
    */
    private resolveDropWeight(
        weight: DropWeightType,
        rareBonusValue: number,
        item: ItemDTO,
        mob: MobModel,
    ): number {
        let baseWeight = DROP_WEIGHT[weight]

        if (RARE_DROP_MULTIPLIER[weight]) {
            const targetMultiplier = RARE_DROP_MULTIPLIER[weight]

            baseWeight *= 1 + ((targetMultiplier - 1) * rareBonusValue / 100)
        }

        if (isEquipItem(item)) {
            baseWeight *= this.getEquipLvWeightMultiplier(item, mob)
        }

        return Math.round(baseWeight)
    }

    /**
    * Calcula el multiplicador de weight para equipamiento según la
    * diferencia entre el nivel del mob y el nivel requerido del ítem.
    *
    * Cuanto mayor sea la diferencia a favor del mob, mayor será el
    * multiplicador aplicado, hasta el límite configurado.
    *
    * Ejemplo:
    * - Mob lv 40 / Item lv 40 -> x1
    * - Mob lv 40 / Item lv 35 -> bonus parcial
    * - Mob lv 40 / Item lv 30 -> multiplicador máximo
    *
    * @param item Ítem de equipamiento candidato.
    * @param mob Mob que genera el drop.
    *
    * @returns Multiplicador aplicado al weight del equipamiento.
    */
    private getEquipLvWeightMultiplier(item: EquipType, mob: MobModel): number {
        const levelDifference = Math.max(0, mob.lv - item.lvReq)

        const cappedDifference = Math.min(
            levelDifference,
            EQUIP_DROP_LV_WEIGHT_CONFIG.maxLevelDifference,
        )

        const progress =
            cappedDifference / EQUIP_DROP_LV_WEIGHT_CONFIG.maxLevelDifference

        return 1 + progress * (EQUIP_DROP_LV_WEIGHT_CONFIG.maxMultiplier - 1)
    }
}
