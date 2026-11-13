import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Atributos, BuffSkillValueScaling, CharacterRace, CharacterSpeciality, SkillBuff, Stats } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import { SkillScalingConfigService } from '../skill-scaling-config.service';
import type { SkillScalingContext } from '../../types/skill-scaling-context.type';

/** Calcula duración, modificadores y efectos consumibles del buff; no gestiona usos restantes. */
@Injectable()
export class BuffSkillService {
    constructor(
        private readonly scalingValues: SharedSkillScalingService,
        private readonly configs: SkillScalingConfigService,
    ) {}

    /** Busca el escalado de buff y calcula con la maestría, stats y atributos recibidos. */
    getUpdatedSkill(skill: SkillBuff, race: CharacterRace, speciality: CharacterSpeciality,
        stats: Stats, attributes: Atributos): SkillBuff {
        const scaling = this.configs.getSkillScalingInfo(skill.id, race, speciality);
        if (scaling.type !== 'buff') throw new InternalServerErrorException('Escalado de buff inválido');
        return this.buildUpdatedSkill(skill, scaling, this.scalingValues.createContext(skill, stats, attributes));
    }

    /** Devuelve una copia con efectos desbloqueados, multiplicadores y usos iniciales enteros >= 1. */
    buildUpdatedSkill(skill: SkillBuff, scaling: BuffSkillValueScaling, context: SkillScalingContext): SkillBuff {
        return {
            ...skill,
            escalado: structuredClone(scaling),
            cd: this.scalingValues.calculateCooldowns(scaling.cd, context),
            mana: this.scalingValues.calculateManaCost(scaling.mana, context),
            duration: this.scalingValues.calculateDuration(scaling.duration, context),
            stats: this.scalingValues.calculateStatModifiers(scaling.statsModifiers, context),
            tags: scaling.tags ? [...scaling.tags] : undefined,
            effects: scaling.effects.filter(effect => this.scalingValues.isUnlocked(effect.unlockAt, context)).map(effect => ({
                type: effect.type,
                allowedSkillIds: [...effect.allowedSkillIds],
                consumeOn: effect.consumeOn,
                description: effect.description,
                multiplier: this.scalingValues.calculateConstrainedValue(effect.multiplier, context, 0),
                uses: this.scalingValues.calculateConstrainedValue(effect.uses, context, 1, true),
            })),
        };
    }
}
