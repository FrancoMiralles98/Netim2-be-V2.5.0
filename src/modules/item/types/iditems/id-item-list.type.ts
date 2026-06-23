import { ArmaduraChamanIdItem } from "./equipo/armaduras/armadura-chaman-id-item.enum";
import { ArmaduraGuerreroIdItem } from "./equipo/armaduras/armadura-guerrero-id-item.enum";
import { ArmaduraNinjaIdItem } from "./equipo/armaduras/armadura-ninja-id-item.enum";
import { ArmaduraSuraIdItem } from "./equipo/armaduras/armadura-sura-id-item.enum";
import { ArcoIdItem } from "./equipo/armas/arco-id-items.enum";
import { CampanaIdItems } from "./equipo/armas/campana-id-items.enum";
import { DagaIdItems } from "./equipo/armas/daga-id-items.enum";
import { DosManosIdItem } from "./equipo/armas/dos-manos-id-items.enum";
import { EspadaIdItems } from "./equipo/armas/espada-id-items.enum";
import { FanIdItem } from "./equipo/armas/fan-id-items.enum";
import { BotasIdItem } from "./equipo/botas-id-item.enum";
import { BrazaleteIdItem } from "./equipo/brazalete-id-item.enum";
import { CascoChamanIdItem } from "./equipo/casco/casco-chaman-id-item.enum";
import { CascoGuerreroIdITem } from "./equipo/casco/casco-guerrero-id-item.enum";
import { CascoNinjaIdItem } from "./equipo/casco/casco-ninja-id-item.enum";
import { CascoSuraIdItem } from "./equipo/casco/casco-sura-id-item.enum";
import { CollarIdItem } from "./equipo/collar-id-item.enum";
import { EscudoIdItem } from "./equipo/escudo-id-item.enum";
import { LegendarioIdITem } from "./equipo/legendario-id-item.enum";
import { PendienteIdItem } from "./equipo/pendiente-id-item.enum";
import { BuffoIdItem } from "./miscs/buffo-id-item.enum";
import { CofresIdItem } from "./miscs/cofres-id-item.enum";
import { LibroIdItem } from "./miscs/libros-id-item.enum";
import { MaterialIdITem } from "./miscs/materiales-id-item.enum";
import { MonturaIdItem } from "./miscs/montura-id-item.enum";
import { PiedraIdItem } from "./miscs/piedra-id-item.enum";
import { PocionIdItem } from "./miscs/pocion-id-item.enum";
import { SpecialMiscIdITem } from "./miscs/special-miscs.enum";

export const IdItem = {
  ...ArmaduraChamanIdItem,
  ...ArmaduraGuerreroIdItem,
  ...ArmaduraNinjaIdItem,
  ...ArmaduraSuraIdItem,
  ...CascoChamanIdItem,
  ...CascoGuerreroIdITem,
  ...CascoNinjaIdItem,
  ...CascoSuraIdItem,
  ...ArcoIdItem,
  ...CampanaIdItems,
  ...DagaIdItems,
  ...DosManosIdItem,
  ...EspadaIdItems,
  ...FanIdItem,
  ...LegendarioIdITem,
  ...CascoChamanIdItem,
  ...CascoGuerreroIdITem,
  ...CascoNinjaIdItem,
  ...CascoSuraIdItem,
  ...BotasIdItem,
  ...BrazaleteIdItem,
  ...CollarIdItem,
  ...EscudoIdItem,
  ...PendienteIdItem,
  ...BuffoIdItem,
  ...CofresIdItem,
  ...LibroIdItem,
  ...MaterialIdITem,
  ...MonturaIdItem,
  ...PiedraIdItem,
  ...PocionIdItem,
  ...SpecialMiscIdITem,
} as const;

export type IdItemList = (typeof IdItem)[keyof typeof IdItem];