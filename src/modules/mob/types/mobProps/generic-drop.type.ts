import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type"

export interface DropDescription {
    idItem:IdItemList,
    upgradeMax?:{min:number, max: number},
    cantidad?:{min:number, max: number}
}


export interface GenericDrop {
    comun: DropDescription[],
    poco_comun: DropDescription[],
    raro:DropDescription[]
}