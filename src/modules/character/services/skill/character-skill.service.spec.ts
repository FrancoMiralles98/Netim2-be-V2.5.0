import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { CharacterRace } from 'netim2-shared';
import { SkillModule } from '../../../skill/skill.module';
import { ALL_SKILLS } from '../../../skill/const/skills';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CHARACTER_SPECIALITYS } from '../../const/character-specialitys.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { GetCharacterSpecialitySkillsDto } from '../../dto/get-character-speciality-skills.dto';
import { CharacterSkillService } from './character-skill.service';
import { CharacterSkillOrchestratorService } from './character-skill-orchestrator.service';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { SkillService } from '../../../skill/skill.service';
import { SKILL_SCALING_BY_RACE_CONFIG } from '../../../skill/config/skillScaling/skill-scaling-by-race.const';

describe('Character speciality skills preview', () => {
    let module: TestingModule;
    let service: CharacterSkillService;
    beforeAll(async () => {
        module = await Test.createTestingModule({ imports: [SkillModule], providers: [CharacterSkillService,
            UpdateStatsService, CharacterLevelScalingService, CharacterAttributesService,
            EquipStatsCalculatorService, BuffStatsCalculatorService, LimitBonusService] }).compile();
        service = module.get(CharacterSkillService);
    });
    afterAll(async () => { await module?.close(); });

    it('calculates every configured speciality at level 1 without changing character or catalog', () => {
        const catalog = structuredClone(ALL_SKILLS);
        const scalingCatalog = structuredClone(SKILL_SCALING_BY_RACE_CONFIG);
        for (const [race, specialities] of Object.entries(CHARACTER_SPECIALITYS)) {
            for (const speciality of specialities) {
                const character = structuredClone(GENERAL_CHARACTER);
                character.raza = race as CharacterRace;
                character.stats.general.ad = { min: 50, max: 100 };
                character.stats.general.ap = { min: 30, max: 80 };
                const before = structuredClone(character);
                const { skills, stats, attributes } = service.getSpecialitySkills(character, { speciality });
                expect(stats.general.hp.max).toBeGreaterThan(0);
                expect(attributes).toEqual(character.atributos);
                expect(skills.map(skill => skill.id)).toEqual(ALL_SKILLS[speciality].map(skill => skill.id));
                for (const skill of skills) {
                    expect(skill.lv).toBe(1);
                    expect(skill.mastery).toBe('N');
                    expect(skill.nombre).not.toBe('');
                    const scaling = SKILL_SCALING_BY_RACE_CONFIG[character.raza][speciality]?.[skill.id];
                    expect(skill.escalado.type).toBe(skill.type);
                    expect(skill.escalado).toEqual(scaling);
                    expect(skill.escalado).not.toBe(scaling);
                    if (skill.type === 'damage' || skill.type === 'heal') {
                        expect(skill.components.length).toBeGreaterThan(0);
                        for (const component of skill.components) {
                            expect(Number.isFinite(component.range.min)).toBe(true);
                            expect(component.range.max).toBeGreaterThanOrEqual(component.range.min);
                        }
                    }
                }
                expect(character).toEqual(before);
            }
        }
        expect(ALL_SKILLS).toEqual(catalog);
        expect(SKILL_SCALING_BY_RACE_CONFIG).toEqual(scalingCatalog);
    });

    it('returns scaling copies in the base pool and refreshes stale scaling when calculating', () => {
        const skillService = module.get(SkillService);
        const character = structuredClone(GENERAL_CHARACTER);
        character.raza = 'guerrero';
        const base = skillService.getSpecialitySkillPool('Corporal')[0];
        const scaling = SKILL_SCALING_BY_RACE_CONFIG.guerrero.Corporal?.[base.id];
        expect(base.escalado).toEqual(scaling);
        expect(base.escalado).not.toBe(scaling);
        base.escalado.mana.base = -999;
        const updated = skillService.getUpdatedSkill(base, character.raza, 'Corporal', character.stats, character.atributos);
        expect(updated.escalado).toEqual(scaling);
        expect(updated.escalado).not.toBe(scaling);
        expect(scaling?.mana.base).not.toBe(-999);
    });

    it('uses the active equipment and character context to recalculate before calculating skills', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.raza = 'guerrero';
        character.especialidad = 'Mental';
        character.lv = 42;
        character.equipo_selected = 2;
        character.atributos.STR = { lvPoints: 20, bonusPoints: 999 };
        character.stats.general.ad = { min: 99999, max: 99999 };
        const before = structuredClone(character);
        const calculator = module.get(UpdateStatsService);
        const update = jest.spyOn(calculator, 'updateStats');
        const calculateSkill = jest.spyOn(module.get(SkillService), 'getUpdatedSkill');
        try {
            const response = service.getSpecialitySkills(character, { speciality: 'Corporal' });
            expect(update).toHaveBeenCalledTimes(1);
            expect(update).toHaveBeenCalledWith(character.stats, character.raza, character.equipo_2,
                character.atributos, character.buffos, character.lv, character.especialidad, character.reino);
            expect(response.attributes.STR.bonusPoints).toBe(0);
            expect(response.stats.general.ad.max).toBeLessThan(99999);
            expect(response).toMatchObject(update.mock.results[0].value);
            for (const call of calculateSkill.mock.calls) {
                expect(call[3]).toBe(response.stats);
                expect(call[4]).toBe(response.attributes);
            }
            expect(update.mock.invocationCallOrder[0]).toBeLessThan(calculateSkill.mock.invocationCallOrder[0]);
            expect(character).toEqual(before);
        } finally {
            update.mockRestore();
            calculateSkill.mockRestore();
        }
    });

    it('rejects a speciality belonging to another race and invalid DTO values', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.raza = 'guerrero';
        expect(() => service.getSpecialitySkills(character, { speciality: 'Luz' })).toThrow(BadRequestException);
        expect(validateSync(Object.assign(new GetCharacterSpecialitySkillsDto(), { speciality: 'invalid' }))).not.toHaveLength(0);
        expect(validateSync(Object.assign(new GetCharacterSpecialitySkillsDto(), { speciality: 'Corporal' }))).toHaveLength(0);
    });

    it('loads the owned character once and denies another account before calculation', async () => {
        const document = { user_owner: 'owner' };
        const repository = { getCharacterById: jest.fn().mockResolvedValue(document) };
        const mapper = { fromDb: jest.fn().mockReturnValue(GENERAL_CHARACTER) };
        const response = { skills: [], stats: GENERAL_CHARACTER.stats, attributes: GENERAL_CHARACTER.atributos };
        const actions = { getSpecialitySkills: jest.fn().mockReturnValue(response) };
        const orchestrator = new CharacterSkillOrchestratorService(repository as unknown as CharacterRepository,
            mapper as unknown as CharacterMapper, actions as unknown as CharacterSkillService);
        const request = { speciality: 'Corporal' as const };
        await expect(orchestrator.getSpecialitySkills('character', 'owner', request)).resolves.toEqual(response);
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(actions.getSpecialitySkills).toHaveBeenCalledWith(GENERAL_CHARACTER, request);
        actions.getSpecialitySkills.mockClear();
        await expect(orchestrator.getSpecialitySkills('character', 'other', request)).rejects.toThrow(ForbiddenException);
        expect(actions.getSpecialitySkills).not.toHaveBeenCalled();
    });
});
