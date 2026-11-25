import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import type { CharacterPersistence, MobType } from 'netim2-shared';
import { base_timers_pvm_multiplier } from '../../../gameData/const/timers.const';

type TimerKey = 'timer_mob' | 'timer_metin' | 'timer_boss';

/** Comprueba y aplica el cooldown por tipo de enemigo usando timestamps en milisegundos. */
@Injectable()
export class CharacterFightTimerService {
    /** Usa timer_lv en segundos y aplica la reducción porcentual del personaje al iniciar el encuentro. */
    applyTimer(character: CharacterPersistence, enemyType: MobType['enemie_type'], now = Date.now()): void {
        const settings: Record<MobType['enemie_type'], { key: TimerKey; multiplier: number }> = {
            mob: { key: 'timer_mob', multiplier: base_timers_pvm_multiplier.mob },
            netim: { key: 'timer_metin', multiplier: base_timers_pvm_multiplier.netims },
            boss: { key: 'timer_boss', multiplier: base_timers_pvm_multiplier.boss },
            raid: { key: 'timer_boss', multiplier: base_timers_pvm_multiplier.boss },
        };
        const { key, multiplier } = settings[enemyType];
        const expiresAt = character[key];
        const reduction = character.stats.bonus.miscs.time_reduction;
        if (!Number.isFinite(expiresAt) || !Number.isFinite(character.timer_lv) || character.timer_lv < 0 ||
            !Number.isFinite(reduction)) {
            throw new BadRequestException('La configuración del timer de combate no es válida');
        }
        if (expiresAt > now) {
            throw new ConflictException({ message: 'Todavía no puedes pelear contra este tipo de enemigo',
                timer: key, expiresAt, remainingMs: expiresAt - now });
        }
        const duration = character.timer_lv * 1000 * multiplier * (1 - Math.min(100, Math.max(0, reduction)) / 100);
        character[key] = now + Math.ceil(duration);
    }
}
