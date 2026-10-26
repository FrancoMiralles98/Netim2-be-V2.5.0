import { GENERAL_CHARACTER } from '../const/general-character.const';
import { EXP_PER_LV } from '../const/exp-per-lv.const';
import { CharacterMapper } from '../mapper/character-mapper';

describe('CharacterEntity EXP progression', () => {
    const mapper = new CharacterMapper();
    function character() {
        return { ...structuredClone(GENERAL_CHARACTER), lv: 1, exp: 0, exp_next_lv: EXP_PER_LV[1],
            atribute_per_lv: 0, puntos_atributos: 0, puntos_habilidad: 0 };
    }

    it.each([
        [124, 0], [125, 1], [249, 1], [250, 2], [374, 2], [375, 3], [499, 3],
    ])('grants %i EXP and reaches exactly %i attribute milestones', (exp, points) => {
        const entity = mapper.toDomain(character());
        entity.gainExp(exp);
        expect(entity.toPrimitives()).toMatchObject({ lv: 1, exp, puntos_atributos: points,
            atribute_per_lv: points, puntos_habilidad: 0 });
    });

    it('grants the three missing attribute points and one skill point at level up, resetting only the milestone counter', () => {
        const entity = mapper.toDomain(character());
        entity.gainExp(EXP_PER_LV[1]);
        expect(entity.toPrimitives()).toMatchObject({ lv: 2, exp: 0, exp_next_lv: EXP_PER_LV[2],
            puntos_atributos: 3, puntos_habilidad: 1, atribute_per_lv: 0 });
        entity.gainExp(EXP_PER_LV[2] / 4);
        expect(entity.toPrimitives()).toMatchObject({ puntos_atributos: 4, puntos_habilidad: 1, atribute_per_lv: 1 });
    });

    it('handles several levels and applies the remaining EXP to the final level', () => {
        const entity = mapper.toDomain(character());
        entity.gainExp(EXP_PER_LV[1] + EXP_PER_LV[2] + EXP_PER_LV[3] / 4);
        expect(entity.toPrimitives()).toMatchObject({ lv: 3, exp: 625, exp_next_lv: EXP_PER_LV[3],
            puntos_atributos: 7, puntos_habilidad: 2, atribute_per_lv: 1 });
        const batched = mapper.toDomain(character());
        for (const exp of [125, 125, 125, 125, 325, 975, 625]) batched.gainExp(exp);
        expect(batched.toPrimitives()).toEqual(entity.toPrimitives());
    });

    it('never lowers the milestone counter or repeats 25% and 50% rewards after losing EXP', () => {
        const entity = mapper.toDomain({ ...character(), exp: 100, atribute_per_lv: 2, puntos_atributos: 2 });
        entity.gainExp(25); // 25% de nuevo; ya cobrado.
        expect(entity.toPrimitives()).toMatchObject({ exp: 125, atribute_per_lv: 2, puntos_atributos: 2 });
        entity.gainExp(125); // 50% de nuevo; ya cobrado.
        expect(entity.toPrimitives()).toMatchObject({ exp: 250, atribute_per_lv: 2, puntos_atributos: 2 });
        entity.gainExp(125); // Primer 75% de este nivel.
        expect(entity.toPrimitives()).toMatchObject({ exp: 375, atribute_per_lv: 3, puntos_atributos: 3 });
    });

    it('does not refund spent points when a character recovers all previously reached milestones', () => {
        const entity = mapper.toDomain({ ...character(), atribute_per_lv: 3 });
        for (const exp of [125, 125, 125]) {
            entity.gainExp(exp);
            expect(entity.toPrimitives()).toMatchObject({ atribute_per_lv: 3, puntos_atributos: 0 });
        }
        entity.gainExp(125);
        expect(entity.toPrimitives()).toMatchObject({ lv: 2, atribute_per_lv: 0, puntos_atributos: 0, puntos_habilidad: 1 });
    });

    it('grants missing attributes at the maximum level, caps EXP and never grants an extra skill point', () => {
        const entity = mapper.toDomain({ ...character(), lv: 125, exp_next_lv: EXP_PER_LV[125] });
        entity.gainExp(EXP_PER_LV[125] + 100);
        expect(entity.toPrimitives()).toMatchObject({ lv: 125, exp: EXP_PER_LV[125],
            atribute_per_lv: 3, puntos_atributos: 3, puntos_habilidad: 0 });
        const capped = entity.toPrimitives();
        entity.gainExp(1000);
        expect(entity.toPrimitives()).toEqual(capped);
    });

    it('awards all intermediate levels including the final level when a large reward reaches the level cap', () => {
        const entity = mapper.toDomain({ ...character(), lv: 124, exp_next_lv: EXP_PER_LV[124] });
        entity.gainExp(EXP_PER_LV[124] + EXP_PER_LV[125]);
        expect(entity.toPrimitives()).toMatchObject({ lv: 125, exp: EXP_PER_LV[125],
            puntos_atributos: 6, puntos_habilidad: 1, atribute_per_lv: 3 });
    });

    it.each([-1, NaN, Infinity, -Infinity])('rejects invalid EXP %s without changing progression', exp => {
        const entity = mapper.toDomain(character());
        const before = entity.toPrimitives();
        expect(() => entity.gainExp(exp)).toThrow();
        expect(entity.toPrimitives()).toEqual(before);
    });

    it('does nothing for a zero reward', () => {
        const entity = mapper.toDomain(character());
        const before = entity.toPrimitives();
        entity.gainExp(0);
        expect(entity.toPrimitives()).toEqual(before);
    });
});
