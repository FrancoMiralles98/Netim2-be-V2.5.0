import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Atributos, CharacterRace, CharacterSpeciality, SkillAura, Stats } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import { SkillScalingConfigService } from '../skill-scaling-config.service';

/** Reconstruye los valores del aura desde su configuración y el contexto del personaje. */
@Injectable()
export class AuraSkillService {
    constructor(
        private readonly scalingValues: SharedSkillScalingService,
        private readonly configs: SkillScalingConfigService,
    ) {}

    /** Devuelve una copia con coste, cooldown, duración y modificadores calculados; no activa el aura. */
    getUpdatedAura(skill: SkillAura, stats: Stats, race: CharacterRace,
        speciality: CharacterSpeciality, attributes: Atributos): SkillAura {
        const scaling = this.configs.getSkillScalingInfo(skill.id, race, speciality);
        if (scaling.type !== 'aura') throw new InternalServerErrorException('Escalado de aura inválido');
        const context = this.scalingValues.createContext(skill, stats, attributes);
        return {
            ...skill,
            escalado: structuredClone(scaling),
            cd: this.scalingValues.calculateCooldowns(scaling.cd, context),
            mana: this.scalingValues.calculateManaCost(scaling.mana, context),
            duration: this.scalingValues.calculateDuration(scaling.duration, context),
            statsModifiers: this.scalingValues.calculateStatModifiers(scaling.statsModifiers, context),
            tags: [...scaling.tags],
        };
    }
}
