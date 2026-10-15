import { CharacterDomain } from "../types/character-domain.type";
import { ATTRIBUTE_SPECIALITY_CAPS } from "../const/statsProgress/attribute-speciality-caps.const";
import { ATTRIBUTE_RACE_CAPS } from "../const/statsProgress/attribute-race-caps.const";
import { ATTRIBUTE_POINT_PROGRESSION } from "../const/statsProgress/attribute-point-progression.const";
import { EXP_PER_LV } from "../const/exp-per-lv.const";
import { isUtilityItem } from "src/modules/item/types/item-type-guard.type";
import {  AddItemResult, AttributesRefKeys, CharacterPersistence, CharacterRace, CharacterSpeciality, EquipType, InventoryChangeResult, InventoryItem, ItemDTO, ItemsToConsumeType, MasteryLvRank, Position, subTypeEquip } from "netim2-shared";
import { SkillAuraEntity } from "src/modules/skill/entities/skill-aura.entity";
import { SkillDamageEntity } from "src/modules/skill/entities/skill-damage.entity";
import { SkillBuffEntity } from "src/modules/skill/entities/skill-buff.entity";
import { Inventory } from "../../inventory/entities/inventory.entity";

export class CharacterEntity {
    private readonly MAX_LV = 125 //nivel maximo del personaje 

    constructor(private props: CharacterDomain) { }

    toPrimitives(): CharacterPersistence {
        return structuredClone({
            ...this.props,
            inventario: this.props.inventario.getInventory(),
            hab: this.props.hab.map(h => h.toPrimitives())
        })
    }

    setCurrentHp(hp: number): void {
        if (hp <= 0) {
            //se pone 1 porque cuando muere, al revivir lo haria con 1 punto de vida
            this.props.stats.general.hp.actual = 1
            return
        }
        if (hp > this.props.stats.general.hp.max) {
            this.props.stats.general.hp.actual = this.props.stats.general.hp.max
            return
        }
        this.props.stats.general.hp.actual = hp
    }

    addItemToInventory(item: ItemDTO): AddItemResult {
        return this.props.inventario.addItem(item)
    }

    removeItemFromInventory(id: string): InventoryItem {
        return this.props.inventario.removeItemById(id)
    }

    /** Equipa una instancia del inventario. Prepara el intercambio antes de modificar el personaje. */
    equipItemFromInventory(itemId: string): AddItemResult {
        const equipmentKey = this.getSelectedEquipmentKey();
        const item = this.props.inventario.getItemById(itemId);
        if (item.type !== 'equip') {
            throw new Error('El ítem seleccionado no es equipamiento');
        }
        if (!item.restricted.includes(this.props.raza)) {
            throw new Error('El equipamiento no es compatible con la raza del personaje');
        }
        if (this.props.lv < item.lvReq) {
            throw new Error('El personaje no tiene el nivel requerido para equipar el ítem');
        }

        const currentEquipment = this.props[equipmentKey];
        const matchingItems = currentEquipment.filter(equipped => equipped.sub_type_equip === item.sub_type_equip);
        if (matchingItems.length > 1) {
            throw new Error('El equipo contiene más de un ítem del mismo subtipo');
        }
        const previous = matchingItems[0];
        const nextInventory = new Inventory(structuredClone(this.props.inventario.getInventory()));
        const removedItem = nextInventory.removeItemById(itemId);
        // El ítem entrante libera espacio; se verifica el tamaño real del reemplazado.
        const inventoryChanges: AddItemResult = previous
            ? this.returnEquipmentToInventory(nextInventory, previous)
            : { newItems: [], updatedItems: [] };
        // Sin cantidad, el contrato indica eliminar la instancia del inventario.
        inventoryChanges.updatedItems.push({ id: removedItem.id });

        // El ID de instancia viaja con el equipo; su antigua posición solo pertenece al inventario.
        const { position, ...equippedItem } = structuredClone(item);
        const nextEquipment = currentEquipment.filter(equipped => equipped.sub_type_equip !== item.sub_type_equip);
        nextEquipment.push(equippedItem);
        this.props.inventario = nextInventory;
        this.props[equipmentKey] = nextEquipment;
        if (item.sub_type_equip === 'arma') {
            this.props.type_weapon = item.type_weapon ?? '';
        }
        return structuredClone(inventoryChanges);
    }

    /** Retira un slot del set activo solo después de verificar y preparar su regreso al inventario. */
    unequipItemToInventory(subType: subTypeEquip): AddItemResult {
        const equipmentKey = this.getSelectedEquipmentKey();
        const currentEquipment = this.props[equipmentKey];
        const matches = currentEquipment.filter(item => item.sub_type_equip === subType);
        if (matches.length === 0) {
            throw new Error('No hay un ítem equipado en el slot indicado');
        }
        if (matches.length > 1) {
            throw new Error('El equipo contiene más de un ítem del mismo subtipo');
        }
        const nextInventory = new Inventory(structuredClone(this.props.inventario.getInventory()));
        const inventoryChanges = this.returnEquipmentToInventory(nextInventory, matches[0]);
        this.props.inventario = nextInventory;
        this.props[equipmentKey] = currentEquipment.filter(item => item.sub_type_equip !== subType);
        if (subType === 'arma') this.props.type_weapon = '';
        return structuredClone(inventoryChanges);
    }

    unlockEquipmentSlot(slot: 1 | 2 | 3): void {
        const keys = { 1: 'equipo1_on', 2: 'equipo2_on', 3: 'equipo3_on' } as const;
        const key = keys[slot];
        if (!key) throw new Error('Slot de equipo inválido');
        if (this.props.equipo_options[key]) throw new Error('El slot de equipo ya está desbloqueado');
        this.props.equipo_options[key] = true;
    }

    selectEquipment(slot: 1 | 2 | 3): void {
        const equipmentKey = this.getSelectedEquipmentKey(slot);
        const weapon = this.props[equipmentKey].find(item => item.sub_type_equip === 'arma');
        this.props.equipo_selected = slot;
        this.props.type_weapon = weapon?.type_weapon ?? '';
    }

    private getSelectedEquipmentKey(slot: 1 | 2 | 3 = this.props.equipo_selected): 'equipo_1' | 'equipo_2' | 'equipo_3' {
        const sets = {
            1: { key: 'equipo_1', enabled: this.props.equipo_options.equipo1_on },
            2: { key: 'equipo_2', enabled: this.props.equipo_options.equipo2_on },
            3: { key: 'equipo_3', enabled: this.props.equipo_options.equipo3_on },
        } as const;
        const selected = sets[slot];
        if (!selected || !selected.enabled) {
            throw new Error('El set de equipo seleccionado no está habilitado');
        }
        return selected.key;
    }

    private returnEquipmentToInventory(inventory: Inventory, item: EquipType): AddItemResult {
        if (!inventory.findFirstAvailableSpace(item)) {
            throw new Error('No hay espacio suficiente en el inventario para el ítem desequipado');
        }
        const added = inventory.addItem(item);
        // Los equipos legacy pueden no tener ID; los que sí lo tienen conservan su instancia.
        if ('id' in item && typeof item.id === 'string') added.newItems[0].id = item.id;
        return added;
    }

    moveItemFromInventory(id: string, position: Position): InventoryItem {
        return this.props.inventario.moveItem(id, position)
    }

    consumeItemsFromInventory(itemsToConsume: ItemsToConsumeType[]): InventoryChangeResult[] {
        return this.props.inventario.consumeItems(itemsToConsume)
    }

    buyItem(item: ItemDTO, price: number): AddItemResult {
        if (!this.canBuyItem(price)) {
            throw new Error('No se puede comprar el item, yang insuficiente')
        }
        const result = this.props.inventario.addItem(item)
        this.removeYang(price)
        return result
    }
    /**
     * Vende un ítem del inventario.
     *
     * - Consume el ítem (o cantidad si es stackeable)
     * - Calcula la ganancia en Yang
     * - Suma el Yang al personaje
     */
    sellItem(itemToSell: InventoryItem): InventoryChangeResult[] {
        const result = this.props.inventario.consumeItems([{
            idItem: itemToSell.idItem,
            cantidad: isUtilityItem(itemToSell) ? itemToSell.cantidad : undefined,
            id: itemToSell.id
        }])

        const gain = isUtilityItem(itemToSell) ?
            itemToSell.cantidad * itemToSell.price
            : itemToSell.price

        this.addYang(gain)

        return result
    }

    /**
    * Aplica experiencia al personaje y gestiona el leveo.
    *
    * Flujo:
    * - Suma la EXP recibida de forma progresiva
    * - Calcula cuánta EXP falta para subir de nivel
    * - Otorga puntos de atributo según el % alcanzado
    * - Si alcanza el límite, sube de nivel y continúa con la EXP restante
    * - Si está en nivel máximo, capea la EXP y termina
    *
    * @param expToGain Cantidad de experiencia a agregar
    */
    gainExp(expToGain: number): void {
        let remainingExp = expToGain;
        while (remainingExp > 0) {

            const expNeeded = this.props.exp_next_lv - this.props.exp
            const expApplied = Math.min(remainingExp, expNeeded)

            this.props.exp += expApplied;
            remainingExp -= expApplied;

            /**
             * Se calcula el porcentage de la EXP total que tiene el personaje
             * ya que con eso se calcula los puntos de atributo @see checkGainAttributePoint
             */
            const percentageExp = (this.props.exp * 100) / this.props.exp_next_lv;

            if (percentageExp >= 100 && this.props.lv === this.MAX_LV) {
                this.props.exp = this.props.exp_next_lv
                break;
            }

            const attributePointGained = this.checkGainAttributePoint(percentageExp)
            this.props.puntos_atributos += attributePointGained

            if (this.props.exp >= this.props.exp_next_lv) {
                expToGain = expToGain + this.props.exp - this.props.exp_next_lv
                this.props.exp = 0
                this.lvUp()
            }
        }
    }

    lvUp(): void {
        //si esta al maximo lv, se queda en el nivel maximo con 100% de EXP
        if (this.props.lv >= this.MAX_LV) {
            throw new Error('Error al subir de nivel: nivel máximo alcanzado')
        }
        this.props.lv += 1
        //El valor 0 significa que ahora tiene disponible conseguir los puntos de atributo correspondiente
        this.props.atribute_per_lv = 0
        this.props.puntos_habilidad += 1
        this.props.exp_next_lv = EXP_PER_LV[this.props.lv]
    }

    addYang(value: number): void {
        this.props.yang += value
    }

    removeYang(value: number): void {
        if (this.props.yang - value < 0) {
            throw new Error('No se puede reducir mas yang de lo que se tiene')
        }
        this.props.yang -= value
    }


    isAlive(): boolean {
        return this.props.stats.general.hp.actual > 0
    }

    increaseAttribute(attribute: AttributesRefKeys): void {
        if (!this.canIncreaseAttribute(attribute)) {
            throw new Error(`No es posible incrementar el atributo: ${attribute}`)
        }
        this.props.atributos[attribute].lvPoints += 1
        this.props.puntos_atributos -= 1
    }

    increaseSkillLv(idSkill: number): SkillAuraEntity | SkillDamageEntity | SkillBuffEntity {
        const skill = this.findSkillById(idSkill)
        if (!this.canUpgradeSkill(skill.lv)) {
            throw new Error(`No se puede subir de nivel la skill idSkill: ${idSkill} `)
        }
        if (typeof skill.lv === 'number') {
            this.props.puntos_habilidad -= 1
        }
        //skill.upgradeRankLv()
        return skill
    }

    private canBuyItem(value: number): boolean {
        return this.props.yang >= value
    }

    private canIncreaseAttribute(attribute: AttributesRefKeys): boolean {
        const cap = this.getAttributeCap(attribute, this.props.raza, this.props.especialidad)
        return (
            this.props.atributos[attribute].lvPoints < cap &&
            this.props.puntos_atributos > 0
        )
    }

    private canUpgradeSkill(lv: number | MasteryLvRank): boolean {
        if (typeof lv === 'string') {
            return lv !== 'P' ? true : false
        }
        return this.props.puntos_habilidad > 0
    }

    /**
     * Obtiene el Cap maximo de atributo a subir de la especialidad y raza especifica
     * @param attribute - atributo que se desea aumentar
     * @param race - raza del personaje
     * @param speciality - especialidad del personaje si ya la tiene
     * @returns 
     */
    private getAttributeCap(
        attribute: AttributesRefKeys,
        race: CharacterRace,
        speciality?: CharacterSpeciality): number {

        const attributesCaps = speciality && ATTRIBUTE_SPECIALITY_CAPS[speciality] ?
            ATTRIBUTE_SPECIALITY_CAPS[speciality]
            : ATTRIBUTE_RACE_CAPS[race]

        if (attributesCaps[attribute] === undefined) {
            throw new Error(`No se encuentra el valor del atributo: ${attribute}`)
        }

        return attributesCaps[attribute]
    }

    private findSkillById(idSkill: number): SkillAuraEntity | SkillDamageEntity | SkillBuffEntity {
        const skill = this.props.hab.find(h => h.idSkill === idSkill)
        if (!skill) {
            throw new Error(`No se encuentra la skill idSkill: ${idSkill}`)
        }
        return skill
    }

    /**
    * Calcula cuántos puntos de atributo debe ganar el personaje
    * según el porcentaje de experiencia actual dentro del nivel.
    *
    * Funcionamiento:
    * - Compara el porcentaje de EXP con los umbrales definidos en
    *   `AttributePointProgression` (25%, 50%, 75%).
    * - Determina el progreso actual (1, 2 o 3) en base a esos valores.
    * - Calcula la diferencia con el progreso anterior (`atribute_per_lv`)
    *   para saber cuántos puntos nuevos corresponden.
    * - Actualiza el progreso interno para evitar duplicar recompensas.
    *
    * Nota:
    * - La lógica completa de los umbrales y su comportamiento se encuentra
    *   documentada en @see AttributePointProgression.
    *
    * @param percentageExp Porcentaje actual de EXP dentro del nivel
    * @returns Cantidad de puntos de atributo ganados
    */
    private checkGainAttributePoint(percentageExp: number): number {
        //atribute_per_lv son los puntos de atributo ya obtenidos en el nivel 
        let newAttributeProgress = this.props.atribute_per_lv;

        if (percentageExp >= ATTRIBUTE_POINT_PROGRESSION.THIRD) {
            newAttributeProgress = 3;
        } else if (percentageExp >= ATTRIBUTE_POINT_PROGRESSION.SECOND) {
            newAttributeProgress = 2;
        } else if (percentageExp >= ATTRIBUTE_POINT_PROGRESSION.FIRST) {
            newAttributeProgress = 1;
        }

        const gainedPoints = newAttributeProgress - this.props.atribute_per_lv;

        this.props.atribute_per_lv = newAttributeProgress;

        return Math.max(gainedPoints, 0);
    }
}
