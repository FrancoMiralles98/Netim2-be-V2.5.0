import { allFullNameBonusList, AppliedBuffos, BonusInItem, ReinosNames, RoutStatKey } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { ReinosBuff } from '../../../gameData/reinos/reinos-buff.config';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { CharacterLevelScalingService } from './calculator/character-level-scaling.service';
import { CharacterAttributesService } from './calculator/character-attributes.service';
import { EquipStatsCalculatorService } from './calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from './calculator/buff-stats-calculator.service';
import { UpdateStatsService } from './update-stats.service';

describe('UpdateStatsService kingdom and movement dodge', () => {
    const service = new UpdateStatsService(new CharacterLevelScalingService(), new CharacterAttributesService(),
        new EquipStatsCalculatorService(), new BuffStatsCalculatorService(), new LimitBonusService());
    function buff(target: RoutStatKey, value: number, operation: 'flat' | 'porcentage' = 'flat'): AppliedBuffos {
        const bonus: BonusInItem = {
            bonusRef: 'vm', bonusFullName: allFullNameBonusList.VELOCIDAD_DE_MOVIMIENTO,
            bonusValue: value, origin: 'configured', category: { type: 'generic', tier: 1 }, displayFormat: 'flat',
            effects: { type: 'stat_modifiers', target: [target], operation },
        };
        return { implicitBonus: [bonus], corruptBonus: [], id_buff: 1, buff_duration: 60,
            buff_base_duration: 60, buff_inicialization: Date.now(), buff_name: '', buff_description: '' };
    }
    function calculate(buffs: AppliedBuffos[] = [], kingdom?: ReinosNames) {
        return service.updateStats(GENERAL_CHARACTER.stats, 'guerrero', [], GENERAL_CHARACTER.atributos, buffs, 1, undefined, kingdom);
    }

    it.each(['shinsoo', 'chunjo', 'jinno'] as const)('applies the configured bonuses for %s without accumulating on recalculation', kingdom => {
        const original = structuredClone(GENERAL_CHARACTER);
        const config = structuredClone(ReinosBuff);
        const first = calculate([], kingdom);
        const expected = kingdom === 'shinsoo'
            ? { bonus_yang: 10, chances_objetos: 10, chances_raros: 10 }
            : kingdom === 'chunjo' ? { habilidad: 7 } : { media: 7 };
        expect(kingdom === 'shinsoo' ? first.stats.bonus.miscs : first.stats.bonus.daño).toMatchObject(expected);
        expect(service.updateStats(first.stats, 'guerrero', [], first.attributes, [], 1, undefined, kingdom)).toEqual(first);
        expect(GENERAL_CHARACTER).toEqual(original);
        expect(ReinosBuff).toEqual(config);
    });

    it('replaces the previous kingdom contribution and combines it with other flat and percentage bonuses', () => {
        const shinsoo = calculate([], 'shinsoo');
        const jinno = service.updateStats(shinsoo.stats, 'guerrero', [], shinsoo.attributes, [], 1, undefined, 'jinno');
        expect(jinno.stats.bonus.miscs.bonus_yang).toBe(0);
        expect(jinno.stats.bonus.daño.media).toBe(7);
        expect(calculate([buff('bonus.daño.media', 3), buff('bonus.daño.media', 20, 'porcentage')], 'jinno').stats.bonus.daño.media).toBe(12);
    });

    it('adds dodge from total movement after flat and percentage bonuses', () => {
        const result = calculate([buff('general.vm', 100), buff('general.vm', 20, 'porcentage'),
            buff('bonus.defensa.esquivar_ataques', 10), buff('bonus.defensa.esquivar_hechizos', 5)]);
        expect(result.stats.general.vm).toBe(120);
        expect(result.stats.bonus.defensa.esquivar_ataques).toBe(46);
        expect(result.stats.bonus.defensa.esquivar_hechizos).toBe(23);
    });

    it('caps the combined dodge and ignores negative movement for this contribution', () => {
        const high = calculate([buff('general.vm', 1000)]);
        expect(high.stats.bonus.defensa.esquivar_ataques).toBe(50);
        expect(high.stats.bonus.defensa.esquivar_hechizos).toBe(50);
        const negative = calculate([buff('general.vm', -100), buff('bonus.defensa.esquivar_ataques', 10)]);
        expect(negative.stats.bonus.defensa.esquivar_ataques).toBe(10);
        expect(negative.stats.bonus.defensa.esquivar_hechizos).toBe(0);
    });
});
