import { CoreImplicitItem } from "../../types/const/scaling/core-equip-item.type";
import { DOS_MANOS_SCALING } from "./weapons/dos-manos-scaling.const";
import { ESPADA_SCALING } from "./weapons/espada-scaling.const";
import { ARCO_SCALING } from "./weapons/arco-scaling.const";
import { CAMPANA_SCALING } from "./weapons/campana-scaling.const";
import { DAGA_SCALING } from "./weapons/daga-scaling.const";
import { FAN_SCALING } from "./weapons/fan-scaling.const";
import { ARMADURA_SCALING } from "./armor/armadura-scaling.const";
import { BOTAS_SCALING } from "./armor/botas-scaling.const";
import { CASCO_SCALING } from "./armor/casco-scaling.const";
import { ESCUDO_SCALING } from "./armor/escudo-scaling.const";
import { BRAZALETE_SCALING } from "./acc/brazalete-scaling.const";
import { COLLAR_SCALING } from "./acc/collar-scaling.const";
import { PENDIENTE_SCALING } from "./acc/pendiente-scaling.const";
import { ARMADURA_LEGENDARIO_SCALING } from "./legendarios/armadura-legendario-scaling.const";
import { BOTAS_LEGENDARIO_SCALING } from "./legendarios/botas-legendario-scaling.const";
import { BRAZALETE_LEGENDARIO_SCALING } from "./legendarios/brazalete-legendario-scaling.const";
import { CASCO_LEGENDARIO_SCALING } from "./legendarios/casco-legendario-scaling.const";
import { COLLAR_LEGENDARIO_SCALING } from "./legendarios/collar-legendario-scaling.const";
import { ESCUDO_LEGENDARIO_SCALING } from "./legendarios/escudo-legendario.const";
import { PENDIENTE_LEGENDARIO_SCALING } from "./legendarios/pendiente-legendario-scaling.const";
import { PIEDRAS_SCALING } from "./piedras/piedras-scaling.const";

export const ITEM_SCALING_CONST: CoreImplicitItem[] = [
    ...ESPADA_SCALING,
    ...DOS_MANOS_SCALING,
    ...ARCO_SCALING,
    ...CAMPANA_SCALING,
    ...DAGA_SCALING,
    ...FAN_SCALING,
    ...ARMADURA_SCALING,
    ...BOTAS_SCALING,
    ...CASCO_SCALING,
    ...ESCUDO_SCALING,
    ...BRAZALETE_SCALING,
    ...COLLAR_SCALING,
    ...PENDIENTE_SCALING,
    ...ARMADURA_LEGENDARIO_SCALING,
    ...BOTAS_LEGENDARIO_SCALING,
    ...BRAZALETE_LEGENDARIO_SCALING,
    ...CASCO_LEGENDARIO_SCALING,
    ...COLLAR_LEGENDARIO_SCALING,
    ...ESCUDO_LEGENDARIO_SCALING,
    ...PENDIENTE_LEGENDARIO_SCALING,
    ...PIEDRAS_SCALING
]
