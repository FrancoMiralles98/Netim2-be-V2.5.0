import { Injectable } from '@nestjs/common';
import { ActiveStatusEffectEntity } from '../../entities/active-status-effect.entity';
import { FighterCombatEntity } from '../../entities/fighter-combat.entity';
import { TurnContext } from '../../types/fight/fight-context.types';
import { PeriodicStatusEffectResolution } from '../../types/actionResolution/action-resolution.types';
import { hasStackExtraDamage, isPeriodicDamageEffectData } from '../processors/status-effect-processor.types';
import { DamageResolverService } from './damage-resolver.service';

/** Detona y consume stacks al aplicar el estado, sin adelantar su tick periódico. */
@Injectable()
export class StatusEffectStackResolverService {
    constructor(private readonly damageResolver: DamageResolverService) {}

    /** Resuelve el umbral una sola vez y registra únicamente el daño adicional. */
    resolve(effect: ActiveStatusEffectEntity, target: FighterCombatEntity, context: TurnContext): PeriodicStatusEffectResolution['stackProc'] {
        const data = effect.Effectdata;
        if (!target.isAlive() || !isPeriodicDamageEffectData(data) || !hasStackExtraDamage(data)) return undefined;
        const stacks = effect.consumeStacksForExtraDamage();
        if (!stacks.triggered) return undefined;
        const source = context.fight.getFighter(effect.getSourceFighterId());
        const damagePerProc = data.extraDamageToApplyStacks * data.damagePerTick;
        const totalRequestedDamage = damagePerProc * stacks.procCount;
        const damage = this.damageResolver.resolve({
            attacker: source, target, sourceType: 'status_effect', effect, damageType: 'ad', damage: totalRequestedDamage,
        });
        source.statistics.registerDamageDealt({ source: { type: 'status_effect', effectId: effect.getEffectId() },
            amount: damage.effectiveDamage, damageType: 'ad', delivery: 'direct' });
        target.statistics.registerDamageMitigated({ statusEffectId: effect.getEffectId(), amount: damage.mitigatedAmount });
        return { consumedStacks: stacks.consumedStacks, remainingStacks: stacks.remainingStacks,
            procCount: stacks.procCount, damagePerProc, totalRequestedDamage, damage };
    }
}
