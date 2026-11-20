import { Injectable, NotFoundException } from '@nestjs/common';
import type { GetMobsByUbicationResponse, IdMobList, MobType, UbicationNames } from 'netim2-shared';
import { MOB_LIST } from '../const/mob-list.const';
import { MobFactory } from '../factory/mob.factory';

/** Genera fichas actualizadas desde el catálogo, sin persistir ni reutilizar stats calculadas. */
@Injectable()
export class MobInfoService {
    constructor(private readonly mobFactory: MobFactory) {}

    getMobsByUbication(ubication: UbicationNames): GetMobsByUbicationResponse {
        return MOB_LIST.filter(mob => mob.ubication === ubication)
            .map(({ idMob, dificultad, ubication, nombre, lv, enemie_type }) => ({
                idMob, dificultad, ubication, nombre, lv, enemie_type,
            }));
    }

    getMobInfo(idMob: IdMobList): MobType {
        const definition = MOB_LIST.find(mob => mob.idMob === idMob);
        if (!definition) throw new NotFoundException('No se encuentra el mob en el catálogo');
        // También aísla habilidades, recompensas y spawnConfig de la definición compartida.
        return this.mobFactory.create(structuredClone(definition));
    }
}
