import { BadRequestException, Injectable } from '@nestjs/common';
import type { CharacterPersistenceWithId } from 'netim2-shared';
import { FighterCombatFactory } from '../../../fight/factories/fighter-combat-entity.factory';
import { FightService } from '../../../fight/fight.service';
import { MobInfoService } from '../../../mob/services/mob-info.service';
import type { FightCharacterMobRequest, FightCharacterMobResponse } from 'netim2-shared';
import { CharacterBuffService } from '../item-use/character-buff.service';
import { SkillService } from '../../../skill/skill.service';

/** Prepara el personaje y el mob de catálogo para ejecutar una pelea. */
@Injectable()
export class CharacterFightService {
    constructor(
        private readonly buffs: CharacterBuffService,
        private readonly mobs: MobInfoService,
        private readonly fighters: FighterCombatFactory,
        private readonly fights: FightService,
        private readonly skills: SkillService,
    ) {}

    /** Actualiza stats, buffos y habilidades aprendidas en memoria y enfrenta la cantidad solicitada de instancias independientes. */
    fightMob(character: CharacterPersistenceWithId, { idMob, quantity }: FightCharacterMobRequest): FightCharacterMobResponse {
        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            throw new BadRequestException('La cantidad de mobs debe ser un entero positivo válido');
        }
        const prepared = this.buffs.refreshBuffs(character).character;
        if (prepared.stats.general.hp.actual <= 0) {
            throw new BadRequestException('El personaje debe tener vida para iniciar la pelea');
        }
        const speciality = prepared.especialidad;
        prepared.hab = prepared.hab.map(skill => {
            if (skill.mastery === 'N' && skill.lv === 0) return skill;
            if (!speciality) throw new BadRequestException('El personaje requiere una especialidad para usar habilidades');
            return this.skills.getUpdatedSkill(skill, prepared.raza, speciality, prepared.stats, prepared.atributos);
        });
        const mob = this.mobs.getMobInfo(idMob);
        const mobs = Array.from({ length: quantity }, () => structuredClone(mob));
        const { allies, enemies } = this.fighters.createSidesWithMobs([{ ...prepared, id: character.id }], mobs);
        return this.fights.fight(allies, enemies);
    }
}
