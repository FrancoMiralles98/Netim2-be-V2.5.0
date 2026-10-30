import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Atributos, CharacterRace, CharacterSpeciality, SkillHeal } from 'netim2-shared';
import { SharedSkillService } from '../shared-skill.service';

@Injectable()
export class HealSkillService {
    constructor(private readonly sharedSkillService: SharedSkillService) {}

    getUpdatedSkill(skill: SkillHeal, race: CharacterRace, speciality: CharacterSpeciality, attributes: Atributos): SkillHeal {
        const scaling = this.sharedSkillService.getSkillScalingInfo(skill.id, race, speciality);
        if (scaling.type !== 'heal') throw new InternalServerErrorException(`La skill ${skill.id} no posee escalado de curación`);
        const component = scaling.components;
        const points = this.sharedSkillService.getPointsLvBonification(skill.lv);
        const levelBonus = points * component.escaladoLv.perLv * this.sharedSkillService.getScalingLvValue(skill.lv, component.escaladoLv);
        const attributeMultiplier = this.sharedSkillService.getAttributeBonification(attributes, component.escaladoAtributos!);
        return {
            ...skill,
            escalado: structuredClone(scaling),
            cd: structuredClone(scaling.cd),
            mana: this.sharedSkillService.getManaCost(skill.mana, scaling, skill.lv),
            components: [{
                // El rango base y el incremento por nivel provienen de la configuración de curación.
                range: {
                    min: Math.trunc((component.escaladoMain.min + levelBonus) * attributeMultiplier),
                    max: Math.trunc((component.escaladoMain.max + levelBonus) * attributeMultiplier),
                },
                tags: [...component.tags],
            }],
        };
    }
}
