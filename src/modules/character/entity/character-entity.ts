import { ItemDTO } from "src/modules/item/types/item-dto";
import { CharacterDomain } from "../types/character-props.type";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { ItemsToConsumeType } from "src/modules/inventory/types/items-to-consume.types";
import { InventoryChangeResult } from "src/modules/inventory/types/item-to-update.types";
import { Position } from "src/modules/item/types/entities-props/item-base.type";
import { CharacterAttribute, CharacterRace, CharacterSpeciality } from "../types/baseCharacterProps/character-stats.type";
import { SkillEntity } from "src/modules/skill/entities/skill-base.entity";
import { MasteryLvRank } from "src/modules/skill/types/skill-lv-rank.types";
import { ATTRIBUTE_SPECIALITY_CAPS } from "../const/statsProgress/attribute-speciality-caps.const";
import { ATTRIBUTE_RACE_CAPS } from "../const/statsProgress/attribute-race-caps.const";
import { AddItemResult } from "src/modules/inventory/types/inventory-result.types";
import { isUtilityItem } from "src/modules/shared/types/type-guard";
import { AttributePointProgression } from "../types/attribute-point-progression.enum";
import { EXP_PER_LV } from "../const/exp-per-lv.const";

export class CharacterEntity {
    private readonly MAX_LV = 125 //nivel maximo del personaje 

    constructor(private props: CharacterDomain) { }

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

    gainExp(expToGain: number) {
        let remainingExp = expToGain;
        while (remainingExp > 0) {

            const expNeeded = this.props.exp_next_lv - this.props.exp
            const expApplied = Math.min(remainingExp, expNeeded)

            this.props.exp += expApplied;
            remainingExp -= expApplied;

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

    increaseAttribute(attribute: CharacterAttribute): void {
        if (!this.canIncreaseAttribute(attribute)) {
            throw new Error(`No es posible incrementar el atributo: ${attribute}`)
        }
        this.props.stats.general[attribute].lvPoints += 1
        this.props.puntos_atributos -= 1
    }

    increaseSkillLv(idSkill: number): SkillEntity {
        const skill = this.findSkillById(idSkill)
        if (!this.canUpgradeSkill(skill.lv)) {
            throw new Error(`No se puede subir de nivel la skill idSkill: ${idSkill} `)
        }
        if (typeof skill.lv === 'number') {
            this.props.puntos_habilidad -= 1
        }
        skill.upgradeRankLv()

        return skill
    }

    private canBuyItem(value: number): boolean {
        return this.props.yang >= value
    }

    private canIncreaseAttribute(attribute: CharacterAttribute): boolean {
        const cap = this.getAttributeCap(attribute, this.props.raza, this.props.especialidad)
        return (
            this.props.stats.general[attribute].lvPoints < cap &&
            this.props.puntos_atributos > 0
        )
    }

    private canUpgradeSkill(lv: number | MasteryLvRank): boolean {
        if (typeof lv === 'string') {
            return lv !== 'P' ? true : false
        }
        return this.props.puntos_habilidad > 0
    }

    private getAttributeCap(
        attribute: CharacterAttribute,
        race: CharacterRace,
        speciality: CharacterSpeciality): number {
        const attributesCaps = ATTRIBUTE_SPECIALITY_CAPS[speciality] ?
            ATTRIBUTE_SPECIALITY_CAPS[speciality]
            : ATTRIBUTE_RACE_CAPS[race]

        if (attributesCaps[attribute] === undefined) {
            throw new Error(`No se encuentra el valor del atributo: ${attribute}`)
        }

        return attributesCaps[attribute]
    }

    private findSkillById(idSkill: number): SkillEntity {
        const skill = this.props.hab.find(h => h.idSkill === idSkill)

        if (!skill) {
            throw new Error(`No se encuentra la skill idSkill: ${idSkill}`)
        }
        return skill
    }

    private checkGainAttributePoint(percentageExp: number): number {
        let newAttributeProgress = this.props.atribute_per_lv;

        if (percentageExp >= AttributePointProgression.THIRD) {
            newAttributeProgress = 3;
        } else if (percentageExp >= AttributePointProgression.SECOND) {
            newAttributeProgress = 2;
        } else if (percentageExp >= AttributePointProgression.FIRST) {
            newAttributeProgress = 1;
        }

        const gainedPoints = newAttributeProgress - this.props.atribute_per_lv;

        this.props.atribute_per_lv = newAttributeProgress;

        return Math.max(gainedPoints, 0);
    }
}