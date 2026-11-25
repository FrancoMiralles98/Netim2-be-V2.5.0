import { BadRequestException, Injectable } from '@nestjs/common';
import type { CharacterPersistenceWithId } from 'netim2-shared';
import { FighterCombatFactory } from '../../../fight/factories/fighter-combat-entity.factory';
import { FightService } from '../../../fight/fight.service';
import { MobInfoService } from '../../../mob/services/mob-info.service';
import type { FightCharacterMobRequest } from 'netim2-shared';
import { CharacterBuffService } from '../item-use/character-buff.service';
import { SkillService } from '../../../skill/skill.service';
import { DropService } from '../../../drop/drop.service';
import type { DropResult } from '../../../drop/types/drop-result.type';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterFightTimerService } from './character-fight-timer.service';
import type { CharacterFightResult } from '../../types/character-fight-result.types';

/** Prepara el personaje y el mob de catálogo para ejecutar una pelea. */
@Injectable()
export class CharacterFightService {
    constructor(
        private readonly buffs: CharacterBuffService,
        private readonly mobs: MobInfoService,
        private readonly fighters: FighterCombatFactory,
        private readonly fights: FightService,
        private readonly skills: SkillService,
        private readonly drops: DropService,
        private readonly mapper: CharacterMapper,
        private readonly timers: CharacterFightTimerService,
    ) {}

    /** Verifica el cooldown, ejecuta la pelea y prepara recompensas, estado final e historial. */
    fightMob(character: CharacterPersistenceWithId, { idMob, quantity }: FightCharacterMobRequest): CharacterFightResult {
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
        const startedAt = Date.now();
        this.timers.applyTimer(prepared, mob.enemie_type, startedAt);
        const mobs = Array.from({ length: quantity }, () => structuredClone(mob));
        const { allies, enemies } = this.fighters.createSidesWithMobs([{ ...prepared, id: character.id }], mobs);
        const fight = this.fights.fight(allies, enemies);
        const won = fight.result.outcome === 'winner' && fight.result.winnerSide === 'allies' &&
            (fight.result.winnerFighterIds?.includes(character.id) || fight.result.winnerFighterId === character.id ||
                fight.result.survivingFighterIds.includes(character.id));
        const rewards: DropResult = { exp: 0, yang: 0, items: [] };
        if (won) {
            for (const enemy of mobs) {
                const drop = this.drops.generateMobDrop(enemy, prepared.stats.bonus.miscs);
                rewards.exp += drop.exp;
                rewards.yang += drop.yang;
                rewards.items.push(...drop.items);
            }
        }
        if (!Number.isSafeInteger(rewards.exp) || rewards.exp < 0 ||
            !Number.isSafeInteger(rewards.yang) || rewards.yang < 0 ||
            !Number.isSafeInteger(prepared.yang + rewards.yang)) {
            throw new BadRequestException('Las recompensas de combate exceden los límites permitidos');
        }
        const summary = fight.fighterFightSummary.find(fighter => fighter.fighterId === character.id);
        if (!summary) throw new Error('El resultado de la pelea no contiene el personaje');
        const entity = this.mapper.toDomain(prepared);
        entity.setCurrentHp(summary.resources.hp);
        prepared.stats.general.mana.actual = Math.max(0, Math.min(summary.resources.mana, prepared.stats.general.mana.max));
        if (rewards.exp > 0) entity.gainExp(rewards.exp);
        entity.addYang(rewards.yang);
        const updated = this.buffs.refreshBuffs(this.mapper.toPersistence(entity)).character;
        return {
            character: updated,
            response: {
                ...fight, ...rewards,
                character: {
                    lv: updated.lv, exp: updated.exp, exp_next_lv: updated.exp_next_lv, yang: updated.yang,
                    puntos_atributos: updated.puntos_atributos, puntos_habilidad: updated.puntos_habilidad,
                    atribute_per_lv: updated.atribute_per_lv, stats: updated.stats, atributos: updated.atributos,
                    buffos: updated.buffos, timer_mob: updated.timer_mob, timer_metin: updated.timer_metin,
                    timer_boss: updated.timer_boss,
                },
            },
            historial: {
                fightId: fight.fightPlaybackPayload.fightId, filtro: 'pvm', fecha: startedAt,
                fight: fight.fighterFightSummary, result: fight.result,
                enemies: enemies.map(enemy => ({ fighterId: enemy.id, idMob: mob.idMob, name: mob.nombre })),
                rewards: { expGranted: rewards.exp, yangGranted: rewards.yang, pendingItems: rewards.items },
            },
        };
    }
}
