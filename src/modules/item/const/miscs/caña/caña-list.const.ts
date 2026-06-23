import { createCañaItem } from "src/modules/item/factories/item-builder";
import { CañaType } from "src/modules/item/types/entities-props/caña.type";
import { IdItem } from "src/modules/item/types/iditems/id-item-list.type";

export const CAÑA_LIST: CañaType[] = [
    createCañaItem({
        name: 'Caña de Pescar',
        description: 'Caña clásica hecha de madera usada para pescar.',
        img: '/itemsUtility/Caña_de_Pescar.png',
        idItem: IdItem.CANA_DE_PESCAR,
        pescaSkill: 16,
        price: 5000,
        special: false,
    }),
    createCañaItem({
        name: 'Caña de pescar de fibra de carbono',
        description: 'Esta caña de fibra de carbono de gran calidad te permitirá pescar algn que otro pez gordo.',
        img: '/itemsUtility/Caña_fibra_de_carbono.png',
        idItem: IdItem.CANA_DE_PESCAR_DE_FIBRA_DE_CARBONO,
        pescaSkill: 40,
        price: 150000,
        special: false,
    }),
    createCañaItem({
        name: 'Thalassa',
        description: 'Esta caña de fibra de carbono de gran calidad te permitirá pescar algn que otro pez gordo.',
        img: '/itemsUtility/Thalassa.png',
        leyenda: "La arrojó lejos al océano y le arrancó el corazón.",
        idItem: IdItem.THALASSA,
        pescaSkill: 40,
        price: 150000,
        special: true,
    }),
]