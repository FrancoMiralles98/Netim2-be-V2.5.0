import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { CharacterRace, CharacterSpeciality, UNIQUE_ID_SKILLS } from 'netim2-shared';
import { SKILL_SCALING_BY_RACE_CONFIG } from '../config/skillScaling/skill-scaling-by-race.const';

/** Acceso al catálogo de escalados; mantiene su búsqueda separada del cálculo de valores. */
@Injectable()
export class SkillScalingConfigService {
    /** Obtiene la configuración por ID, raza y especialidad; falla si no existe esa combinación. */
    getSkillScalingInfo(id: UNIQUE_ID_SKILLS, race: CharacterRace, speciality: CharacterSpeciality) {
        const scaling = SKILL_SCALING_BY_RACE_CONFIG[race]?.[speciality]?.[id];
        if (!scaling) throw new InternalServerErrorException(`No hay escalado para skill ${id}, raza ${race}, especialidad ${speciality}`);
        return scaling;
    }
}
