import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { Connection } from 'mongoose';
import { CharacterRace, IdItem, UNIQUE_ID_SKILLS } from 'netim2-shared';
import { SkillModule } from '../../../skill/skill.module';
import { SkillService } from '../../../skill/skill.service';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CHARACTER_SPECIALITYS } from '../../const/character-specialitys.const';
import { CharacterSkillService } from './character-skill.service';
import { CharacterSkillOrchestratorService } from './character-skill-orchestrator.service';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterMapper } from '../../mapper/character-mapper';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { GetSkillUpgradePreviewDto } from '../../dto/get-skill-upgrade-preview.dto';
import { getNextSkillLevel } from './skill-upgrade-progression';
import { hasSkillUpgradeResources, resolveSkillUpgradeCost } from './skill-upgrade-cost';
import { LIBRO_LIST } from '../../../item/const/miscs/libro-list.const';

describe('Skill upgrade preview', () => {
    let module: TestingModule;
    let service: CharacterSkillService;
    beforeAll(async () => {
        module = await Test.createTestingModule({ imports: [SkillModule], providers: [CharacterSkillService,
            UpdateStatsService, CharacterLevelScalingService, CharacterAttributesService,
            EquipStatsCalculatorService, BuffStatsCalculatorService, LimitBonusService] }).compile();
        service = module.get(CharacterSkillService);
    });
    afterAll(async () => { await module?.close(); });

    it.each([
        ['N', 0, 'N', 1], ['N', 15, 'N', 16], ['N', 16, 'M', 1],
        ['M', 9, 'M', 10], ['M', 10, 'G', 1], ['G', 1, 'G', 2], ['G', 10, 'P', 1],
    ] as const)('resolves %s%d -> %s%d', (mastery, lv, nextMastery, nextLv) => {
        expect(getNextSkillLevel({ mastery, lv })).toEqual({ mastery: nextMastery, lv: nextLv });
    });
    it('rejects invalid levels instead of calculating M11/G11', () => {
        for (const mastery of ['N', 'M', 'G'] as const) {
            expect(() => getNextSkillLevel({ mastery, lv: 100 })).toThrow(BadRequestException);
        }
        expect(() => getNextSkillLevel({ mastery: 'M', lv: 0 })).toThrow(BadRequestException);
        expect(getNextSkillLevel({ mastery: 'P', lv: 1 })).toBeNull();
    });

    it('calculates all skills and mastery boundaries without mutating any input', () => {
        for (const [race, specialities] of Object.entries(CHARACTER_SPECIALITYS)) {
            for (const speciality of specialities) {
                const character = structuredClone(GENERAL_CHARACTER);
                character.raza = race as CharacterRace;
                character.especialidad = speciality;
                character.puntos_habilidad = 1;
                character.hab = module.get(SkillService).getSpecialitySkillPool(speciality);
                for (const skill of character.hab) {
                    for (const [mastery, lv] of [['N', 0], ['N', 1], ['N', 16], ['M', 10], ['G', 10], ['P', 1]] as const) {
                        Object.assign(skill, { mastery, lv });
                        const before = structuredClone(character);
                        const result = service.getUpgradePreview(character, { skillId: skill.id });
                        expect(result.current).toMatchObject({ id: skill.id, mastery, lv });
                        expect(result.next && { mastery: result.next.mastery, lv: result.next.lv }).toEqual(getNextSkillLevel(skill));
                        expect(result.canUpgrade).toBe(mastery === 'N');
                        expect(result.current.nombre.length).toBeGreaterThan(0);
                        if (result.next) expect(result.next.nombre.length).toBeGreaterThan(0);
                        expect(character).toEqual(before);
                    }
                }
            }
        }
    });

    it('counts only the required book across inventory stacks', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.especialidad = 'Corporal';
        character.hab = module.get(SkillService).getSpecialitySkillPool('Corporal');
        const skill = character.hab[0];
        const material = LIBRO_LIST.find(item => item.idItem === IdItem.LIBRO_DE_CORTE_DE_TRES_MANERAS)!;
        Object.assign(skill, { mastery: 'M', lv: 3 });
        const request = { skillId: skill.id };
        expect(service.getUpgradePreview(character, request)).toMatchObject({
            cost: { type: 'materials', items: [{ idItem: material.idItem, amount: 3 }] }, canUpgrade: false,
        });
        character.inventario = [1, 2].map((cantidad, index) => ({ ...structuredClone(material), cantidad,
            id: 'stack-' + index, position: { col: index, row: 0 } }));
        expect(service.getUpgradePreview(character, request).canUpgrade).toBe(true);
        skill.lv = 4;
        expect(service.getUpgradePreview(character, request).canUpgrade).toBe(false);
        expect(hasSkillUpgradeResources(character, { type: 'materials', items: [{ idItem: IdItem.PIEDRA_ALMA, amount: 1 }] })).toBe(false);
    });

    it('resolves quantities by mastery and honors the Golpe de Dedo book override', () => {
        const id = UNIQUE_ID_SKILLS.GOLPE_DE_DEDO;
        expect(resolveSkillUpgradeCost({ id, mastery: 'N', lv: 16 })).toEqual({ type: 'skill_points', amount: 1 });
        expect(resolveSkillUpgradeCost({ id, mastery: 'M', lv: 1 }))
            .toEqual({ type: 'materials', items: [{ idItem: IdItem.LIBRO_DE_GOLPE_OSCURO, amount: 1 }] });
        expect(resolveSkillUpgradeCost({ id, mastery: 'M', lv: 10 }))
            .toEqual({ type: 'materials', items: [{ idItem: IdItem.LIBRO_DE_GOLPE_OSCURO, amount: 10 }] });
        expect(resolveSkillUpgradeCost({ id, mastery: 'G', lv: 5 }))
            .toEqual({ type: 'materials', items: [{ idItem: IdItem.PIEDRA_ALMA, amount: 5 }] });
        expect(resolveSkillUpgradeCost({ id, mastery: 'P', lv: 1 })).toBeNull();
    });

    it('spends the required books across stacks and advances M10 to G1', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.especialidad = 'Corporal';
        character.hab = module.get(SkillService).getSpecialitySkillPool('Corporal');
        const skill = character.hab[0];
        Object.assign(skill, { mastery: 'M', lv: 10 });
        const material = LIBRO_LIST.find(item => item.idItem === IdItem.LIBRO_DE_CORTE_DE_TRES_MANERAS)!;
        character.inventario = [4, 8].map((cantidad, index) => ({ ...structuredClone(material), cantidad,
            id: `stack-${index}`, position: { col: index, row: 0 } }));
        const before = structuredClone(character);
        const result = service.upgradeSkill(character, { skillId: skill.id });
        expect(result.response.skill).toMatchObject({ id: skill.id, mastery: 'G', lv: 1 });
        expect(result.character.hab[0]).toEqual(result.response.skill);
        expect(result.character.inventario).toMatchObject([{ id: 'stack-1', cantidad: 2 }]);
        expect(result.response.updatedItems).toHaveLength(2);
        expect(result.character.puntos_habilidad).toBe(character.puntos_habilidad);
        expect(character).toEqual(before);
    });

    it('learns N0 with one skill point and rejects a subsequent upgrade without resources', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.especialidad = 'Corporal';
        character.hab = module.get(SkillService).getSpecialitySkillPool('Corporal');
        character.hab[0].lv = 0;
        character.puntos_habilidad = 1;
        const request = { skillId: character.hab[0].id };
        const result = service.upgradeSkill(character, request);
        expect(result.response.skill).toMatchObject({ mastery: 'N', lv: 1 });
        expect(result.response.puntos_habilidad).toBe(0);
        expect(result.response.updatedItems).toEqual([]);
        expect(() => service.upgradeSkill(result.character, request)).toThrow(BadRequestException);
    });

    it('rejects foreign skills and invalid DTO payloads', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.especialidad = 'Corporal';
        expect(() => service.getUpgradePreview(character, { skillId: UNIQUE_ID_SKILLS.GOLPE_OSCURO })).toThrow(BadRequestException);
        expect(validateSync(Object.assign(new GetSkillUpgradePreviewDto(), { skillId: '1' }))).not.toHaveLength(0);
        expect(validateSync(Object.assign(new GetSkillUpgradePreviewDto(), { skillId: 99999 }))).not.toHaveLength(0);
        expect(validateSync(Object.assign(new GetSkillUpgradePreviewDto(), { skillId: UNIQUE_ID_SKILLS.GOLPE_OSCURO }))).toHaveLength(0);
    });

    it('refreshes stale stored runtime data and keeps N0 unlearned', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.especialidad = 'Corporal';
        character.hab = module.get(SkillService).getSpecialitySkillPool('Corporal');
        const skill = character.hab.find(skill => skill.type === 'damage')!;
        skill.lv = 0;
        skill.components.range = { min: 99999, max: 99999 };
        const result = service.getUpgradePreview(character, { skillId: skill.id });
        expect(result.current.type === 'damage' && result.current.components.range).toEqual({ min: 0, max: 0 });
        expect(result.next).toMatchObject({ mastery: 'N', lv: 1 });
        expect(result.next?.type === 'damage' && result.next.components.range.min).not.toBe(99999);
    });

    it('checks ownership before computing and never writes', async () => {
        const repository = { getCharacterById: jest.fn().mockResolvedValue({ user_owner: 'owner' }), updateCharacterById: jest.fn() };
        const mapper = { fromDb: jest.fn().mockReturnValue(GENERAL_CHARACTER) };
        const actions = { getUpgradePreview: jest.fn().mockReturnValue({ canUpgrade: false }) };
        const orchestrator = new CharacterSkillOrchestratorService(repository as unknown as CharacterRepository,
            mapper as unknown as CharacterMapper, actions as unknown as CharacterSkillService, {} as Connection);
        const request = { skillId: UNIQUE_ID_SKILLS.GOLPE_OSCURO };
        await expect(orchestrator.getUpgradePreview('character', 'other', request)).rejects.toThrow(ForbiddenException);
        expect(actions.getUpgradePreview).not.toHaveBeenCalled();
        await expect(orchestrator.getUpgradePreview('character', 'owner', request)).resolves.toEqual({ canUpgrade: false });
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });
});
