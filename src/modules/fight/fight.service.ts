import { Injectable } from '@nestjs/common';
import { FightVsMobInput } from './fight-services.type';
import { CharacterService } from '../character/character.service';
import { MobService } from '../mob/mob.service';
import { MobModel } from '../mob/schema/mob.schema';
import { FightEngine } from './engine/fight-engine';

/**
 * Servicio principal encargado de ejecutar peleas.
 */
@Injectable()
export class FightService {
    constructor(
        private characterService: CharacterService,
        private mobService: MobService,
        private fightEngine: FightEngine,
    ) { }

    async fightVsMobs({ characterId, userId, mobs }: FightVsMobInput) {
        const [character, mobsToFight] = await Promise.all([
            this.characterService.getCharacterById(characterId, userId),
            this.getMobs(mobs)
        ]);

        const result = this.fightEngine.executeAgainstMobs([character], mobsToFight)
    }

    private async getMobs(mobs: FightVsMobInput['mobs']): Promise<MobModel[]> {
        const mobIds = mobs.map(({ mobId }) => mobId);

        const mobsData = await this.mobService.getMobsByIdMobs(mobIds);

        const listMobs: MobModel[] = [];

        for (const mobData of mobsData) {
            const mobConfig = mobs.find(
                ({ mobId }) => mobId === mobData.idMob
            );

            if (!mobConfig) continue;

            for (let i = 0; i < mobConfig.quantity; i++) {
                listMobs.push(structuredClone(mobData));
            }
        }

        return listMobs;
    }
}
