import { ItemDTO } from "netim2-shared";
import { GUERRERO_ARMORS } from "./equip/armors/guerrero-armors.const";
import { NINJA_ARMORS } from "./equip/armors/ninja-armors.const";
import { CHAMAN_ARMORS } from "./equip/armors/chaman-armors.const";
import { ARMADURA_LIST } from "./equip/armors/sura-armors.const";
import { ESPADA_LIST } from "./equip/weapons/espada-list.const";
import { DOS_MANOS_LIST } from "./equip/weapons/dos-manos-list.const";
import { ARCO_LIST } from "./equip/weapons/arco-list.const";
import { CAMPANA_LIST } from "./equip/weapons/campana-list.const";
import { DAGA_LIST } from "./equip/weapons/daga-list.const";
import { FAN_LIST } from "./equip/weapons/fan-list.const";
import { BOTAS_LIST } from "./equip/botas-list.const";
import { BRAZALETE_LIST } from "./equip/brazalete-list.const";
import { CHAMAN_HELMET } from "./equip/cascos-list.const";
import { COLLAR_LIST } from "./equip/collar-list.const";
import { ESCUDO_LIST } from "./equip/escudo-list.const";
import { PENDIENTE_LIST } from "./equip/pendiente-list.const";
import { ARMADURAS_LEGENDARIAS_LIST } from "./equip/legendarios/armadura-legendarias-list.const";
import { BOTAS_LEGENDARIO_LIST } from "./equip/legendarios/botas-legendario-list.const";
import { BRAZALETE_LEGENDARIO_LIST } from "./equip/legendarios/brazalete-legendario-list.const";
import { CASCO_LEGENDARIAS_LIST } from "./equip/legendarios/casco-legendario-list.const";
import { COLLAR_LEGENDARIO_LIST } from "./equip/legendarios/collar-legendario.const";
import { ESCUDO_LEGENDARIO_LIST } from "./equip/legendarios/escudo-legendario-list.const";
import { PENDIENTE_LEGENDARIO_LIST } from "./equip/legendarios/pendiente-legendario-list.const";
import { LIBRO_LIST } from "./miscs/libro-list.const";
import { MATERIALES_LIST } from "./miscs/materiales-list.const";
import { BUFF_LIST } from "./miscs/buff/buff-list.const";
import { CAÑA_LIST } from "./miscs/caña/caña-list.const";
import { CHEST_LIST } from "./miscs/chest/chest-list.const";
import { LICENCIA_MONTURA_LIST } from "./miscs/montura/lincencia-montura-list.const";
import { PIEDRA_LIST } from "./miscs/piedra/piedra-list.const";
import { POCION_LIST } from "./miscs/pocion/pocion-list.const";
import { SPECIAL_MISCS } from "./miscs/special/special-mics-list.const";

export const ITEM_LIST: ItemDTO[] = [
    ...GUERRERO_ARMORS,
    ...NINJA_ARMORS,
    ...CHAMAN_ARMORS,
    ...ARMADURA_LIST,
    ...ESPADA_LIST,
    ...DOS_MANOS_LIST,
    ...ARCO_LIST,
    ...CAMPANA_LIST,
    ...DAGA_LIST,
    ...FAN_LIST,
    ...BOTAS_LIST,
    ...BRAZALETE_LIST,
    ...CHAMAN_HELMET,
    ...COLLAR_LIST,
    ...ESCUDO_LIST,
    ...PENDIENTE_LIST,
    ...ARMADURAS_LEGENDARIAS_LIST,
    ...BOTAS_LEGENDARIO_LIST,
    ...BRAZALETE_LEGENDARIO_LIST,
    ...CASCO_LEGENDARIAS_LIST,
    ...COLLAR_LEGENDARIO_LIST,
    ...ESCUDO_LEGENDARIO_LIST,
    ...PENDIENTE_LEGENDARIO_LIST,
    ...LIBRO_LIST,
    ...MATERIALES_LIST,
    ...BUFF_LIST,
    ...CAÑA_LIST,
    ...CHEST_LIST,
    ...LICENCIA_MONTURA_LIST,
    ...PIEDRA_LIST,
    ...POCION_LIST,
    ...SPECIAL_MISCS,
]
