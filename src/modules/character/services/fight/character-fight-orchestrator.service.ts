import { ForbiddenException, Injectable } from '@nestjs/common';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import type { FightCharacterMobRequest, FightCharacterMobResponse } from 'netim2-shared';
import { CharacterFightService } from './character-fight.service';

/** Carga el personaje autenticado y delega la ejecución del combate. */
@Injectable()
export class CharacterFightOrchestratorService {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly mapper: CharacterMapper,
        private readonly fights: CharacterFightService,
    ) {}

    /** Valida la propiedad del personaje y devuelve la pelea contra el mob solicitado. */
    async fightMob(characterId: string, accountId: string, request: FightCharacterMobRequest): Promise<FightCharacterMobResponse> {
        const document = await this.repository.getCharacterById(characterId);
        if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
        return this.fights.fightMob({ ...this.mapper.fromDb(document), id: characterId }, request);
    }
}
