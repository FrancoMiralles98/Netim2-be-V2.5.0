import { BadRequestException } from '@nestjs/common';
import type { CharacterRace, CharacterSpeciality } from 'netim2-shared';
import { CharacterService } from '../character/character.service';
import { CharacterMapper } from '../character/mapper/character-mapper';
import { ATTRIBUTE_RACE_CAPS } from '../character/const/statsProgress/attribute-race-caps.const';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../character/const/statsProgress/attribute-speciality-caps.const';
import { EQUIPMENT_SLOTS_CONFIG } from '../character/config/equip-slot.config';
import { ATTRIBUTE_EFFECTS_CONFIG } from './const/attributes-config';
import { RACE_INFO } from './const/race-info.const';
import { GameDatasService } from './game-datas.service';

 describe('GameDatasService game config', () => {
    const service = new GameDatasService({} as CharacterService, new CharacterMapper());

    it.each(['guerrero', 'chaman', 'ninja', 'sura'] as const)('returns only the %s race caps without speciality when absent', race => {
        const result = service.getGameConfig(race);
        expect(result.character.attributeCaps).toEqual({ race: ATTRIBUTE_RACE_CAPS[race] });
        expect(result.character.attributeCaps).not.toHaveProperty('speciality');
        expect(result.attributes.effects).toEqual(ATTRIBUTE_EFFECTS_CONFIG);
        expect(result.equipment.slots).toEqual(EQUIPMENT_SLOTS_CONFIG.slots);
        expect(result.combat).toHaveProperty('bonusEffects');
        expect(result.buff.max_active_buff).toBeGreaterThan(0);
    });

    it('returns the race and speciality caps for every valid race and speciality pair', () => {
        for (const race of RACE_INFO) {
            for (const key of Object.keys(race.especialidades)) {
                if (key === 'base') continue;
                const speciality = key as CharacterSpeciality;
                expect(service.getGameConfig(race.raza, speciality).character.attributeCaps).toEqual({
                    race: ATTRIBUTE_RACE_CAPS[race.raza], speciality: ATTRIBUTE_SPECIALITY_CAPS[speciality],
                });
            }
        }
    });

    it('returns detached copies of caps and the rest of the configuration', () => {
        const result = service.getGameConfig('guerrero', 'Corporal');
        result.character.attributeCaps.race.STR = -999;
        result.character.attributeCaps.speciality!.STR = -999;
        result.attributes.effects.STR = {};
        result.equipment.slots.splice(0);
        const fresh = service.getGameConfig('guerrero', 'Corporal');
        expect(fresh.character.attributeCaps).toEqual({ race: ATTRIBUTE_RACE_CAPS.guerrero, speciality: ATTRIBUTE_SPECIALITY_CAPS.Corporal });
        expect(fresh.character.attributeCaps.race.STR).toBeGreaterThan(0);
        expect(fresh.character.attributeCaps.speciality!.STR).toBeGreaterThan(0);
        expect(fresh.attributes.effects).toEqual(ATTRIBUTE_EFFECTS_CONFIG);
        expect(fresh.equipment.slots).toEqual(EQUIPMENT_SLOTS_CONFIG.slots);
    });

    it('rejects invalid races, specialities and incompatible pairs', () => {
        for (const race of ['invalid', '__proto__', '', undefined]) {
            expect(() => service.getGameConfig(race as CharacterRace)).toThrow(BadRequestException);
        }
        for (const speciality of ['invalid', 'Luz', 'base', '__proto__', '']) {
            expect(() => service.getGameConfig('guerrero', speciality as CharacterSpeciality)).toThrow(BadRequestException);
        }
    });
});
