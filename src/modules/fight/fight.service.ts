import { Injectable } from '@nestjs/common';
import { FightVsMobInput } from './fight-services.type';
import { CharacterService } from '../character/character.service';
import { MobService } from '../mob/mob.service';

/**
 * Servicio principal encargado de ejecutar peleas.
 */
@Injectable()
export class FightService {
    constructor(
        private characterService: CharacterService,
        private mobService: MobService
    ) { }

    fightVsMobs({ characterId, userId, mobs }: FightVsMobInput) {
        const character = this.characterService.getCharacterById(characterId,userId)
        const mobsToFight = this.mobService //todavia no hice el reppository de Mobs
    }
}
