import { BadRequestException } from '@nestjs/common';
import type { AttributesRefKeys, CharacterRace, EquipType } from 'netim2-shared';
import { allFullNameBonusList } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { ATTRIBUTE_RACE_CAPS } from '../../const/statsProgress/attribute-race-caps.const';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../../const/statsProgress/attribute-speciality-caps.const';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { CharacterAttributeService } from './character-attribute.service';

describe('CharacterAttributeService', () => {
    const calculator = new UpdateStatsService(new CharacterLevelScalingService(), new CharacterAttributesService(),
        new EquipStatsCalculatorService(), new BuffStatsCalculatorService(), new LimitBonusService());
    const service = new CharacterAttributeService(new CharacterMapper(), calculator);
    function character() {
        const source = structuredClone(GENERAL_CHARACTER);
        source.raza = 'guerrero';
        source.especialidad = undefined;
        source.puntos_atributos = 3;
        source.stats.general.hp.actual = 10;
        source.stats.general.mana.actual = 5;
        const { stats, attributes } = calculator.updateStats(source.stats, source.raza, [], source.atributos, [], source.lv, undefined, source.reino);
        source.stats = stats;
        source.atributos = attributes;
        return source;
    }

    it.each(['STR', 'INT', 'DEX', 'VIT'] as const)('allocates exactly one %s point and recalculates stats without mutating input', attribute => {
        const source = character();
        const before = structuredClone(source);
        const result = service.increaseAttribute(source, { attribute });
        expect(result.response.attributes[attribute].lvPoints).toBe(source.atributos[attribute].lvPoints + 1);
        expect(result.response.puntos_atributos).toBe(2);
        expect(result.response.stats).not.toEqual(source.stats);
        expect(result.character.atributos).toEqual(result.response.attributes);
        expect(result.character.stats).toEqual(result.response.stats);
        expect(result.character.puntos_atributos).toBe(2);
        expect(result.response.stats.general.hp.actual).toBe(10);
        expect(result.response.stats.general.mana.actual).toBe(5);
        expect(source).toEqual(before);
    });

    it('consumes the last point and rejects a second allocation', () => {
        const source = character();
        source.puntos_atributos = 1;
        const result = service.increaseAttribute(source, { attribute: 'STR' });
        expect(result.response.puntos_atributos).toBe(0);
        expect(() => service.increaseAttribute(result.character, { attribute: 'STR' })).toThrow(BadRequestException);
    });

    it('accepts exactly the race limit and rejects allocations at or above every race cap', () => {
        for (const race of Object.keys(ATTRIBUTE_RACE_CAPS) as CharacterRace[]) {
            for (const attribute of ['STR', 'INT', 'DEX', 'VIT'] as const) {
                const source = character();
                source.raza = race;
                const cap = ATTRIBUTE_RACE_CAPS[race][attribute];
                source.atributos[attribute].lvPoints = cap - 1;
                const result = service.increaseAttribute(source, { attribute });
                expect(result.response.attributes[attribute].lvPoints).toBe(cap);
                expect(() => service.increaseAttribute(result.character, { attribute })).toThrow(BadRequestException);
                source.atributos[attribute].lvPoints = cap + 1;
                expect(() => service.increaseAttribute(source, { attribute })).toThrow(BadRequestException);
            }
        }
    });

    it('uses speciality caps instead of race caps for all specialities', () => {
        const races = { Corporal: 'guerrero', Mental: 'guerrero', Luz: 'chaman', Dragon: 'chaman',
            Daga: 'ninja', Flecha: 'ninja', Espejo: 'sura', MagiaNegra: 'sura' } as const;
        for (const speciality of Object.keys(races) as (keyof typeof races)[]) {
            const source = character();
            source.raza = races[speciality];
            source.especialidad = speciality;
            const cap = ATTRIBUTE_SPECIALITY_CAPS[speciality]!.STR;
            source.atributos.STR.lvPoints = cap - 1;
            const result = service.increaseAttribute(source, { attribute: 'STR' });
            expect(result.response.attributes.STR.lvPoints).toBe(cap);
            expect(() => service.increaseAttribute(result.character, { attribute: 'STR' })).toThrow(BadRequestException);
        }
    });

    it('keeps bonuses separate from the allocation cap and uses the active equipment, buffs and kingdom', () => {
        const source = character();
        source.atributos.STR.lvPoints = ATTRIBUTE_RACE_CAPS.guerrero.STR - 1;
        source.equipo_selected = 2;
        source.equipo_2 = [{ implicitBonus: [], randomImplicitBonus: [], bonus6_7: [], corruptExplicitBonus: [],
            corruptImplicitBonus: [], piedras: [], explicitBonus: [{ bonusRef: 'STR', bonusFullName: allFullNameBonusList.STR,
                bonusValue: 5, origin: 'configured', displayFormat: 'flat', category: { type: 'generic', tier: 1 },
                effects: { type: 'attribute_modifier', target: 'atribute.STR.bonusPoints', operation: 'flat' } }] }] as unknown as EquipType[];
        const spy = jest.spyOn(calculator, 'updateStats');
        try {
            const result = service.increaseAttribute(source, { attribute: 'STR' });
            expect(result.response.attributes.STR).toEqual({ lvPoints: ATTRIBUTE_RACE_CAPS.guerrero.STR, bonusPoints: 5 });
            expect(spy).toHaveBeenCalledWith(source.stats, source.raza, source.equipo_2,
                expect.any(Object), source.buffos, source.lv, source.especialidad, source.reino);
            const next = service.increaseAttribute(result.character, { attribute: 'VIT' });
            expect(next.response.attributes.STR.bonusPoints).toBe(5);
        } finally { spy.mockRestore(); }
    });

    it.each([0, -1, 1.5, NaN, Infinity])('rejects invalid available point pools %s without mutation', puntos_atributos => {
        const source = { ...character(), puntos_atributos };
        const before = structuredClone(source);
        expect(() => service.increaseAttribute(source, { attribute: 'STR' })).toThrow(BadRequestException);
        expect(source).toEqual(before);
    });

    it.each(['str', 'hp', '', undefined, null, 12])('rejects invalid attributes %s', attribute => {
        expect(() => service.increaseAttribute(character(), { attribute: attribute as AttributesRefKeys })).toThrow(BadRequestException);
    });
});
