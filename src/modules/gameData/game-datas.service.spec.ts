import { BadRequestException } from '@nestjs/common';
import type { CharacterRace, CharacterSpeciality } from 'netim2-shared';
import { UNIQUE_ID_SKILLS } from 'netim2-shared';
import { CharacterService } from '../character/character.service';
import { CharacterMapper } from '../character/mapper/character-mapper';
import { CHARACTER_SPECIALITYS } from '../character/const/character-specialitys.const';
import { ATTRIBUTE_RACE_CAPS } from '../character/const/statsProgress/attribute-race-caps.const';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../character/const/statsProgress/attribute-speciality-caps.const';
import { EQUIPMENT_SLOTS_CONFIG } from '../character/config/equip-slot.config';
import { ALL_SKILLS } from '../skill/const/skills';
import { ATTRIBUTE_EFFECTS_CONFIG } from './const/attributes-config';
import { GameDatasService } from './game-datas.service';

describe('GameDatasService game config', () => {
    const service = new GameDatasService({} as CharacterService, new CharacterMapper());

    it.each(['guerrero', 'chaman', 'ninja', 'sura'] as const)('returns the %s race caps and all enabled specialities and skill IDs', race => {
        const result = service.getGameConfig(race);
        const specialities = CHARACTER_SPECIALITYS[race];
        expect(result.character.race).toEqual(ATTRIBUTE_RACE_CAPS[race]);
        expect(result.character.speciality).toEqual(specialities.map(specialidad => ({ specialidad, caps: ATTRIBUTE_SPECIALITY_CAPS[specialidad] })));
        expect(result.character.idSkillsSpeciality).toEqual(specialities.map(specialidad => ({ specialidad, idSkills: ALL_SKILLS[specialidad].map(skill => skill.id) })));
        expect(result.attributes.effects).toEqual(ATTRIBUTE_EFFECTS_CONFIG);
        expect(result.equipment.slots).toEqual(EQUIPMENT_SLOTS_CONFIG.slots);
        expect(result.combat).toHaveProperty('bonusEffects');
        expect(result.buff.max_active_buff).toBeGreaterThan(0);
    });

    it('returns both specialities even when the character already has one selected', () => {
        const result = service.getGameConfig('guerrero', 'Corporal');
        expect(result.character.speciality.map(entry => entry.specialidad)).toEqual(['Corporal', 'Mental']);
        expect(result.character.idSkillsSpeciality.find(entry => entry.specialidad === 'Corporal')!.idSkills).toEqual([
            UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS, UNIQUE_ID_SKILLS.ROCIADA, UNIQUE_ID_SKILLS.GIRO_DE_ESPADA,
            UNIQUE_ID_SKILLS.BERSEK, UNIQUE_ID_SKILLS.AURA_DE_ESPADA,
        ]);
    });

    it('returns the same race configuration for every valid selected speciality', () => {
        for (const race of Object.keys(CHARACTER_SPECIALITYS) as CharacterRace[]) {
            const expected = service.getGameConfig(race);
            for (const speciality of CHARACTER_SPECIALITYS[race]) expect(service.getGameConfig(race, speciality)).toEqual(expected);
        }
    });

    it('uses CHARACTER_SPECIALITYS as the enabled-speciality source and supports empty lists', () => {
        const before = CHARACTER_SPECIALITYS.guerrero;
        try {
            CHARACTER_SPECIALITYS.guerrero = ['Mental'];
            expect(service.getGameConfig('guerrero').character.speciality).toEqual([{ specialidad: 'Mental', caps: ATTRIBUTE_SPECIALITY_CAPS.Mental }]);
            expect(service.getGameConfig('guerrero').character.idSkillsSpeciality.map(entry => entry.specialidad)).toEqual(['Mental']);
            expect(() => service.getGameConfig('guerrero', 'Corporal')).toThrow(BadRequestException);
            CHARACTER_SPECIALITYS.guerrero = [];
            expect(service.getGameConfig('guerrero').character).toEqual({ race: ATTRIBUTE_RACE_CAPS.guerrero, speciality: [], idSkillsSpeciality: [] });
        } finally { CHARACTER_SPECIALITYS.guerrero = before; }
    });

    it('returns detached caps, skill IDs and the rest of the configuration', () => {
        const before = structuredClone({ caps: ATTRIBUTE_SPECIALITY_CAPS, race: ATTRIBUTE_RACE_CAPS, skills: ALL_SKILLS });
        const result = service.getGameConfig('guerrero');
        result.character.race.STR = -999;
        result.character.speciality[0].caps.STR = -999;
        result.character.idSkillsSpeciality[0].idSkills.splice(0);
        result.attributes.effects.STR = {};
        result.equipment.slots.splice(0);
        expect({ caps: ATTRIBUTE_SPECIALITY_CAPS, race: ATTRIBUTE_RACE_CAPS, skills: ALL_SKILLS }).toEqual(before);
        const fresh = service.getGameConfig('guerrero');
        expect(fresh.character.race.STR).toBeGreaterThan(0);
        expect(fresh.character.speciality[0].caps.STR).toBeGreaterThan(0);
        expect(fresh.character.idSkillsSpeciality[0].idSkills.length).toBeGreaterThan(0);
        expect(fresh.attributes.effects).toEqual(ATTRIBUTE_EFFECTS_CONFIG);
        expect(fresh.equipment.slots).toEqual(EQUIPMENT_SLOTS_CONFIG.slots);
    });

    it('rejects invalid races, specialities and incompatible pairs', () => {
        for (const race of ['invalid', '__proto__', '', undefined]) expect(() => service.getGameConfig(race as CharacterRace)).toThrow(BadRequestException);
        for (const speciality of ['invalid', 'Luz', 'base', '__proto__', '']) {
            expect(() => service.getGameConfig('guerrero', speciality as CharacterSpeciality)).toThrow(BadRequestException);
        }
    });
});
