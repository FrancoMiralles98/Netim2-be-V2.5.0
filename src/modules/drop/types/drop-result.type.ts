import { ItemDTO } from "src/modules/item/types/item-dto";

export interface DropResult {
    yang: number;
    exp: number;
    drop: ItemDTO[]
}