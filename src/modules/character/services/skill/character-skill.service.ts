import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { CharacterPersistence } from 'netim2-shared';
import { SkillService } from '../../../skill/skill.service';
import { ALL_SKILLS_NAMES } from '../../../skill/const/skillsNames';
import { CHARACTER_SPECIALITYS } from '../../const/character-specialitys.const';
import type { GetCharacterSpecialitySkillsRequest, GetCharacterSpecialitySkillsResponse } from 'netim2-shared';
import { UpdateStatsService } from '../stats/update-stats.service';

@Injectable()
export class CharacterSkillService {
    constructor(
        private readonly skillService: SkillService,
        private readonly updateStatsService: UpdateStatsService,
    ) {}

    getSpecialitySkills(character: CharacterPersistence, request: GetCharacterSpecialitySkillsRequest): GetCharacterSpecialitySkillsResponse {
        const speciality = request?.speciality;
        if (!Object.hasOwn(CHARACTER_SPECIALITYS, character.raza) || !CHARACTER_SPECIALITYS[character.raza].includes(speciality)) {
            throw new BadRequestException('La especialidad no está habilitada para la raza del personaje');
        }
        const source = structuredClone(character);
        const equipment = { 1: source.equipo_1, 2: source.equipo_2, 3: source.equipo_3 }[source.equipo_selected];
        if (!equipment) throw new BadRequestException('El equipo seleccionado no es válido');
        const { stats, attributes } = this.updateStatsService.updateStats(
            source.stats, source.raza, equipment, source.atributos, source.buffos,
            source.lv, source.especialidad, source.reino,
        );
        const skills = this.skillService.getSpecialitySkillPool(speciality).map(base => {
            const skill = this.skillService.getUpdatedSkill({ ...structuredClone(base), lv: 1, mastery: 'N' },
                source.raza, speciality, stats, attributes);
            const name = ALL_SKILLS_NAMES[speciality]?.[skill.id]?.N;
            if (!name) throw new InternalServerErrorException(`No hay nombre configurado para la habilidad ${skill.id}`);
            return { ...skill, nombre: name };
        });
        return { skills, stats, attributes };
    }
}
