import { CoreImplicitItem } from "../../types/const/scaling/core-equip-item.type";
import { DOS_MANOS_SCALING } from "./weapons/dos-manos-scaling.const";
import { ESPADA_SCALING } from "./weapons/espada-scaling.const";

export const ITEM_SCALING_CONST: CoreImplicitItem[] = [
    ...ESPADA_SCALING,
    ...DOS_MANOS_SCALING
] 