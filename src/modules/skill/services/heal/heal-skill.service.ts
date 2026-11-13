import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Atributos, CharacterRace, CharacterSpeciality, SkillHeal, Stats } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import { SkillScalingConfigService } from '../skill-scaling-config.service';

/** Calcula el rango de curación y sus costes; no resta maná ni recupera HP. */
@Injectable()
export class HealSkillService {
    constructor(
        private readonly scalingValues: SharedSkillScalingService,
        private readonly configs: SkillScalingConfigService,
    ) {}

    /** Devuelve una copia con mínimo/máximo, flags, cooldown y maná calculados para el personaje. */
    getUpdatedSkill(skill: SkillHeal, race: CharacterRace, speciality: CharacterSpeciality,
        stats: Stats, attributes: Atributos): SkillHeal {
        const scaling = this.configs.getSkillScalingInfo(skill.id, race, speciality);
        if (scaling.type !== 'heal') throw new InternalServerErrorException('Escalado de curación inválido');
        const context = this.scalingValues.createContext(skill, stats, attributes);
        return {
            ...skill,
            escalado: structuredClone(scaling),
            cd: this.scalingValues.calculateCooldowns(scaling.cd, context),
            mana: this.scalingValues.calculateManaCost(scaling.mana, context),
            components: {
                range: this.scalingValues.calculateRange(scaling.components.healing, context),
                tags: [...scaling.components.tags],
            },
            flags: scaling.flags ? { ...scaling.flags } : undefined,
        };
    }
}
