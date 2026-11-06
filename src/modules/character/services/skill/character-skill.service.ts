import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { CharacterPersistence, CharacterSpeciality, SkillType } from 'netim2-shared';
import { SkillService } from '../../../skill/skill.service';
import { ALL_SKILLS_NAMES } from '../../../skill/const/skillsNames';
import { CHARACTER_SPECIALITYS, MIN_LV_TO_SELECT_SPECIALITY } from '../../const/character-specialitys.const';
import type { GetCharacterSpecialitySkillsRequest, GetCharacterSpecialitySkillsResponse,
    SelectCharacterSpecialityRequest, SelectCharacterSpecialityResponse } from 'netim2-shared';
import { UpdateStatsService } from '../stats/update-stats.service';
import type { GetSkillUpgradePreviewRequest, GetSkillUpgradePreviewResponse } from 'netim2-shared';
import { getNextSkillLevel } from './skill-upgrade-progression';
import { hasSkillUpgradeResources, resolveSkillUpgradeCost } from './skill-upgrade-cost';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import type { UpgradeCharacterSkillRequest, UpgradeCharacterSkillResponse } from '../../types/upgrade-character-skill.types';

@Injectable()
export class CharacterSkillService {
    constructor(
        private readonly skillService: SkillService,
        private readonly updateStatsService: UpdateStatsService,
    ) {}

    /** Read-only calculation from one snapshot; neither character nor catalogs are mutated. */
    getUpgradePreview(character: CharacterPersistence, request: GetSkillUpgradePreviewRequest): GetSkillUpgradePreviewResponse {
        const speciality = this.validateSpeciality(character, character.especialidad);
        const owned = character.hab.find(skill => skill.id === request.skillId);
        const base = this.skillService.getSpecialitySkillPool(speciality).find(skill => skill.id === request.skillId);
        if (!owned || !base) throw new BadRequestException('La habilidad no pertenece al personaje o a su especialidad');
        const nextLevel = getNextSkillLevel(owned);
        const source = structuredClone(character);
        const { stats, attributes } = this.calculateStats(source);
        const calculate = (level: Pick<SkillType, 'mastery' | 'lv'>): SkillType => {
            const skill = { ...structuredClone(base), mastery: level.mastery, lv: level.lv };
            const name = ALL_SKILLS_NAMES[speciality]?.[skill.id]?.[level.mastery];
            if (!name) throw new InternalServerErrorException(`No hay nombre configurado para la habilidad ${skill.id}`);
            // N0 is unlearned; preserve the catalog's empty runtime values, never compute it as N1.
            const result = level.mastery === 'N' && level.lv === 0 ? skill
                : this.skillService.getUpdatedSkill(skill, source.raza, speciality, stats, attributes);
            return { ...result, nombre: name };
        };
        const current = calculate(owned);
        if (!nextLevel) return { current, next: null, canUpgrade: false, cost: null, reason: 'La habilidad alcanzó su nivel máximo' };
        const next = calculate(nextLevel);
        const cost = resolveSkillUpgradeCost(current);
        if (!cost) return { current, next, canUpgrade: false, cost: null, reason: 'Los materiales de mejora todavía no están configurados' };
        const canUpgrade = hasSkillUpgradeResources(source, cost);
        return { current, next, cost, canUpgrade, ...(!canUpgrade ? { reason: 'No tienes los recursos necesarios para mejorar la habilidad' } : {}) };
    }

    upgradeSkill(character: CharacterPersistence, request: UpgradeCharacterSkillRequest): {
        character: CharacterPersistence;
        response: UpgradeCharacterSkillResponse;
    } {
        const { next, cost, canUpgrade, reason } = this.getUpgradePreview(character, request);
        if (!next || !cost || !canUpgrade) throw new BadRequestException(reason ?? 'No se puede mejorar la habilidad');

        const updated = structuredClone(character);
        const inventory = new Inventory(updated.inventario);
        const updatedItems = cost.type === 'materials'
            ? inventory.consumeItems(cost.items.map(({ idItem, amount }) => ({ idItem, cantidad: amount })))
            : [];
        if (cost.type === 'skill_points') updated.puntos_habilidad -= cost.amount;
        updated.inventario = inventory.getInventory();
        const index = updated.hab.findIndex(skill => skill.id === next.id);
        updated.hab[index] = next;
        return { character: updated, response: { skill: next, puntos_habilidad: updated.puntos_habilidad, updatedItems } };
    }

    getSpecialitySkills(character: CharacterPersistence, request: GetCharacterSpecialitySkillsRequest): GetCharacterSpecialitySkillsResponse {
        const speciality = this.validateSpeciality(character, request?.speciality);
        const source = structuredClone(character);
        const { stats, attributes } = this.calculateStats(source);
        const skills = this.skillService.getSpecialitySkillPool(speciality).map(base => {
            const skill = this.skillService.getUpdatedSkill({ ...structuredClone(base), lv: 1, mastery: 'N' },
                source.raza, speciality, stats, attributes);
            return { ...skill, nombre: this.getBaseSkillName(speciality, skill.id) };
        });
        return { skills, stats, attributes };
    }

    /** Elige una especialidad una sola vez y arma las habilidades no aprendidas; no persiste ni muta la entrada. */
    selectSpeciality(character: CharacterPersistence, request: SelectCharacterSpecialityRequest): {
        character: CharacterPersistence; response: SelectCharacterSpecialityResponse;
    } {
        const speciality = this.validateSpeciality(character, request?.speciality);
        if (character.especialidad) throw new BadRequestException('El personaje ya tiene una especialidad elegida');
        if (!Number.isSafeInteger(character.lv) || character.lv < MIN_LV_TO_SELECT_SPECIALITY) {
            throw new BadRequestException(`Se requiere nivel ${MIN_LV_TO_SELECT_SPECIALITY} para elegir especialidad`);
        }
        if (character.hab?.length) throw new BadRequestException('El personaje ya tiene habilidades asignadas');

        const updated = structuredClone(character);
        updated.especialidad = speciality;
        const { stats, attributes } = this.calculateStats(updated);
        const skills = this.skillService.getSpecialitySkillPool(speciality).map(base => ({
            ...base,
            lv: 0,
            mastery: 'N' as const,
            nombre: this.getBaseSkillName(speciality, base.id),
        }));
        if (!skills.length) throw new InternalServerErrorException('La especialidad no tiene habilidades configuradas');
        updated.hab = skills;
        updated.stats = stats;
        updated.atributos = attributes;
        return { character: updated, response: { speciality, skills, stats, attributes } };
    }

    private validateSpeciality(character: CharacterPersistence, speciality: CharacterSpeciality | undefined): CharacterSpeciality {
        if (!speciality || !Object.hasOwn(CHARACTER_SPECIALITYS, character.raza)
            || !CHARACTER_SPECIALITYS[character.raza].includes(speciality)) {
            throw new BadRequestException('La especialidad no está habilitada para la raza del personaje');
        }
        return speciality;
    }

    /** Usa el equipo activo y los caps de la especialidad actual del personaje recibido. */
    private calculateStats(character: CharacterPersistence) {
        const equipment = { 1: character.equipo_1, 2: character.equipo_2, 3: character.equipo_3 }[character.equipo_selected];
        if (!equipment) throw new BadRequestException('El equipo seleccionado no es válido');
        return this.updateStatsService.updateStats(character.stats, character.raza, equipment, character.atributos,
            character.buffos, character.lv, character.especialidad, character.reino);
    }

    private getBaseSkillName(speciality: CharacterSpeciality, skillId: SkillType['id']): string {
        const name = ALL_SKILLS_NAMES[speciality]?.[skillId]?.N;
        if (!name) throw new InternalServerErrorException(`No hay nombre configurado para la habilidad ${skillId}`);
        return name;
    }
}
