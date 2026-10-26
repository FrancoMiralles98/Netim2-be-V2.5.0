import { CeboType, IdItem } from "netim2-shared";
import { createCeboType } from "src/modules/item/factories/item-builder";

export const CEBO_LIST: CeboType[] = [
    createCeboType({
        idItem: IdItem.GUSANO,
        description: 'Cebo popular que atrae a los peces',
        name: 'Gusano',
        pescaSkill: 6,
        price: 500,
    }),
    createCeboType({
        idItem: IdItem.PASTA,
        description: 'Un cebo ligero y económico, pero medio torpe para la pesca',
        name: 'Pasta',
        pescaSkill: 3,
        price: 100,
    }),
    createCeboType({
        idItem: IdItem.PECECILLO,
        description: 'Pez pequeño utilizado como cebo para grandes peces',
        name: 'Pececillo',
        pescaSkill: 12,
        price: 1000,
    }),
    createCeboType({
        idItem: IdItem.CAMARON,
        description: 'Un gran cebo  que aumenta las posibilidades de atraer a los peces más exóticos',
        name: 'Camarón',
        pescaSkill: 24,
        price: 2000,
    }),


]
