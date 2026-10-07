import { IdItemList, ItemBaseType, Size } from "netim2-shared";

export abstract class ItemBase {
  protected readonly idItem: IdItemList;
  protected readonly name: string;
  protected readonly size: Size;
  protected readonly img: string;
  protected readonly acc: boolean;

  protected price: number;
  protected corrupt: boolean;
  protected leyenda?: string;

  protected constructor(props: ItemBaseType) {
    this.idItem = props.idItem;
    this.corrupt = props.corrupt ?? false;
    this.img = props.img;
    this.leyenda = props.leyenda;
    this.name = props.name;
    this.acc = props.acc
    this.price = props.price;
    this.size = props.size;
  }

  isCorrupted(): boolean {
    return this.corrupt;
  }
}
