import { allFullNameBonusList, CharacterPersistence, EquipType, IdItem, InventoryItem } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterEquipService } from './character-equip.service';
import { CharacterRepository } from '../../repository/character-repository';
import { UserService } from '../../../user/user.service';
import { Connection } from 'mongoose';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';

describe('CharacterEquipService', () => {
    const mapper = new CharacterMapper();
    const calculator = new UpdateStatsService(
        new CharacterLevelScalingService(), new CharacterAttributesService(),
        new EquipStatsCalculatorService(), new BuffStatsCalculatorService(), new LimitBonusService(),
    );
    const service = new CharacterEquipService(mapper, {} as CharacterRepository, {} as UserService, {} as Connection, calculator);

    function equipment(props: Partial<EquipType> = {}): EquipType {
        return {
            idItem: IdItem.ESPADA, name: 'Espada', price: 1, img: '', acc: false,
            type: 'equip', size: { rows: 1, cols: 1 }, lvReq: 1, itemLv: 1,
            upgradeLv: 0, upgradeMax: 9, sub_type_equip: 'arma', type_weapon: 'espada',
            legendary: false, restricted: ['guerrero'], slot: 0, weight: 0, especial: false,
            implicitBonus: [], randomImplicitBonus: [], explicitBonus: [], piedras: [],
            bonus6_7: [], corruptExplicitBonus: [], corruptImplicitBonus: [], corruptSpecialBonus: [],
            ...props,
        };
    }

    function stored(id: string, props: Partial<EquipType> = {}, row = 0, col = 0): InventoryItem {
        return { ...equipment(props), id, position: { row, col } };
    }

    function character(): CharacterPersistence {
        const result = structuredClone(GENERAL_CHARACTER);
        result.lv = 10;
        result.inventario = [stored('new')];
        return result;
    }

    function fillInventory(character: CharacterPersistence): void {
        character.inventario = [stored('new')];
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 19; col++) {
                if (row === 0 && col === 0) continue;
                character.inventario.push(stored(`filler-${row}-${col}`, {}, row, col));
            }
        }
    }

    it('equips a stored instance and leaves the input untouched', () => {
        const source = character();
        const original = structuredClone(source);
        const { character: result, newItems, updatedItems } = service.equipItem(source, 'new');
        expect(newItems).toEqual([]);
        expect(updatedItems).toEqual([{ id: 'new' }]);
        expect(result.equipo_1).toHaveLength(1);
        expect(result.equipo_1[0]).toMatchObject({ id: 'new', sub_type_equip: 'arma' });
        expect(result.equipo_1[0]).not.toHaveProperty('position');
        expect(result.inventario).toEqual([]);
        expect(result.type_weapon).toBe('espada');
        expect(source).toEqual(original);
    });

    it.each([1, 2, 3] as const)('changes only the enabled selected set %i', selected => {
        const source = character();
        source.equipo_selected = selected;
        source.equipo_options = { equipo1_on: true, equipo2_on: true, equipo3_on: true };
        const key = `equipo_${selected}` as 'equipo_1' | 'equipo_2' | 'equipo_3';
        const others = (['equipo_1', 'equipo_2', 'equipo_3'] as const).filter(set => set !== key);
        for (const other of others) source[other] = [equipment({ name: other })];
        const { character: result } = service.equipItem(source, 'new');
        expect(result[key]).toHaveLength(1);
        for (const other of others) expect(result[other]).toEqual(source[other]);
    });

    it('returns the replaced item to an available grid position and preserves its identity and bonuses', () => {
        const source = character();
        source.equipo_1 = [
            { ...equipment({ name: 'Anterior', upgradeLv: 3 }), id: 'old' } as EquipType,
            equipment({ name: 'Casco', sub_type_equip: 'casco' }),
        ];
        const { character: result } = service.equipItem(source, 'new');
        expect(result.equipo_1.map(item => item.name)).toEqual(['Casco', 'Espada']);
        expect(result.inventario).toHaveLength(1);
        expect(result.inventario[0]).toMatchObject({
            id: 'old', name: 'Anterior', upgradeLv: 3, position: { row: 0, col: 0 },
        });
        expect(result.inventario[0]).not.toBe(source.equipo_1[0]);
    });

    it('allows a full-inventory swap if the replaced item fits the slot released by the incoming item', () => {
        const source = character();
        fillInventory(source);
        source.equipo_1 = [equipment({ name: 'Anterior' })];
        const { character: result } = service.equipItem(source, 'new');
        expect(result.inventario).toHaveLength(114);
        const returned = result.inventario.find(item => item.name === 'Anterior')!;
        expect(returned.position).toEqual({ row: 0, col: 0 });
        expect(returned.id).toEqual(expect.any(String));
        expect(result.inventario.some(item => item.id === 'new')).toBe(false);
    });

    it('rejects insufficient geometric space without altering the character entity or its input', () => {
        const source = character();
        fillInventory(source);
        source.equipo_1 = [equipment({ name: 'Anterior', size: { rows: 2, cols: 1 } })];
        const original = structuredClone(source);
        const entity = mapper.toDomain(structuredClone(source));
        expect(() => entity.equipItemFromInventory('new')).toThrow('No hay espacio suficiente');
        expect(entity.toPrimitives()).toEqual(original);
        expect(() => service.equipItem(source, 'new')).toThrow('No hay espacio suficiente');
        expect(source).toEqual(original);
    });

    it.each([
        [{ restricted: ['chaman'] } as Partial<EquipType>, 'raza'],
        [{ lvReq: 11 }, 'nivel requerido'],
    ])('rejects incompatible equipment %o before changing inventory', (props, error) => {
        const source = character();
        source.inventario = [stored('new', props)];
        const original = structuredClone(source);
        expect(() => service.equipItem(source, 'new')).toThrow(error);
        expect(source).toEqual(original);
    });

    it('accepts equipment at the exact required character level', () => {
        const source = character();
        source.inventario = [stored('new', { lvReq: 10 })];
        expect(service.equipItem(source, 'new').character.equipo_1).toHaveLength(1);
    });

    it('rejects a disabled set, a missing instance ID, and a non-equipment item', () => {
        const disabled = character();
        disabled.equipo_selected = 2;
        expect(() => service.equipItem(disabled, 'new')).toThrow('no está habilitado');
        expect(() => service.equipItem(character(), 'missing')).toThrow('Item No encontrado');
        const source = character();
        source.inventario = [{ ...stored('utility'), type: 'utility', cantidad: 1 } as unknown as InventoryItem];
        expect(() => service.equipItem(source, 'utility')).toThrow('no es equipamiento');
    });

    it('can equip and unequip the same instance without losing identity or item data', () => {
        const source = character();
        const { character: equipped } = service.equipItem(source, 'new');
        const { character: result } = service.unequipItem(equipped, 'arma');
        expect(result.equipo_1).toEqual([]);
        expect(result.inventario).toEqual(source.inventario);
        expect(result.type_weapon).toBe('');
        expect(equipped.equipo_1).toHaveLength(1);
        expect(equipped.inventario).toEqual([]);
    });

    it.each([1, 2, 3] as const)('unequips only the selected enabled set %i', selected => {
        const source = character();
        source.equipo_selected = selected;
        source.equipo_options = { equipo1_on: true, equipo2_on: true, equipo3_on: true };
        const key = `equipo_${selected}` as 'equipo_1' | 'equipo_2' | 'equipo_3';
        for (const set of ['equipo_1', 'equipo_2', 'equipo_3'] as const) {
            source[set] = [equipment(), equipment({ sub_type_equip: 'casco', name: 'Casco' })];
        }
        const { character: result } = service.unequipItem(source, 'arma');
        expect(result[key].map(item => item.sub_type_equip)).toEqual(['casco']);
        for (const set of ['equipo_1', 'equipo_2', 'equipo_3'] as const) {
            if (set !== key) expect(result[set]).toEqual(source[set]);
        }
        expect(result.inventario).toHaveLength(2);
    });

    it('rejects unequipping into a full inventory without modifying entity or persistence', () => {
        const source = character();
        fillInventory(source);
        source.equipo_1 = [equipment()];
        source.type_weapon = 'espada';
        const original = structuredClone(source);
        const entity = mapper.toDomain(structuredClone(source));
        expect(() => entity.unequipItemToInventory('arma')).toThrow('No hay espacio suficiente');
        expect(entity.toPrimitives()).toEqual(original);
        expect(() => service.unequipItem(source, 'arma')).toThrow('No hay espacio suficiente');
        expect(source).toEqual(original);
    });

    it('requires enough contiguous space for the unequipped item size', () => {
        const source = character();
        fillInventory(source);
        source.inventario = source.inventario.filter(item =>
            !(item.position.row === 0 && (item.position.col === 0 || item.position.col === 2)));
        source.equipo_1 = [equipment({ size: { rows: 1, cols: 2 } })];
        const original = structuredClone(source);
        expect(() => service.unequipItem(source, 'arma')).toThrow('No hay espacio suficiente');
        expect(source).toEqual(original);
    });

    it('returns legacy equipment to inventory and preserves weapon metadata when removing another slot', () => {
        const source = character();
        source.equipo_1 = [equipment({ sub_type_equip: 'casco', name: 'Casco', upgradeLv: 3 })];
        source.type_weapon = 'espada';
        const { character: result } = service.unequipItem(source, 'casco');
        expect(result.inventario[1]).toMatchObject({
            id: expect.any(String), name: 'Casco', upgradeLv: 3, position: { row: 0, col: 1 },
        });
        expect(result.type_weapon).toBe('espada');
        expect(result.equipo_1).toEqual([]);
    });

    it('rejects unequipping an empty slot, a disabled set or duplicate slots', () => {
        expect(() => service.unequipItem(character(), 'arma')).toThrow('No hay un ítem equipado');
        const source = character();
        source.equipo_selected = 2;
        expect(() => service.unequipItem(source, 'arma')).toThrow('no está habilitado');
        source.equipo_selected = 1;
        source.equipo_1 = [equipment(), equipment()];
        expect(() => service.unequipItem(source, 'arma')).toThrow('más de un ítem');
    });

    it.each([1, 2, 3] as const)('selects unlocked equipment set %i without changing the source', slot => {
        const source = character();
        source.equipo_options = { equipo1_on: true, equipo2_on: true, equipo3_on: true };
        source[`equipo_${slot}`] = [equipment()];
        const original = structuredClone(source);
        const { character: result, newItems, updatedItems } = service.selectEquipment(source, slot);
        expect(newItems).toEqual([]);
        expect(updatedItems).toEqual([]);
        expect(result.equipo_selected).toBe(slot);
        expect(result.type_weapon).toBe('espada');
        expect(result.inventario).toEqual(source.inventario);
        for (const key of ['equipo_1', 'equipo_2', 'equipo_3'] as const) {
            expect(result[key]).toEqual(source[key]);
        }
        expect(source).toEqual(original);
    });

    it('clears weapon metadata when switching to an empty unlocked set', () => {
        const source = character();
        source.type_weapon = 'espada';
        source.equipo_options.equipo2_on = true;
        const { character: result } = service.selectEquipment(source, 2);
        expect(result.equipo_selected).toBe(2);
        expect(result.type_weapon).toBe('');
    });

    it.each([2, 3, 0, 4])('rejects locked or invalid equipment set %i without mutation', slot => {
        const source = character();
        const original = structuredClone(source);
        const entity = mapper.toDomain(structuredClone(source));
        expect(() => entity.selectEquipment(slot as 1 | 2 | 3)).toThrow('no está habilitado');
        expect(entity.toPrimitives()).toEqual(original);
        expect(() => service.selectEquipment(source, slot as 1 | 2 | 3)).toThrow('no está habilitado');
        expect(source).toEqual(original);
    });

    it('validates the requested set even if the current set is locked', () => {
        const source = character();
        source.equipo_selected = 2;
        expect(service.selectEquipment(source, 1).character.equipo_selected).toBe(1);
    });

    it('recalculates equipment stats through equip, swap, selection and unequip without accumulating stat bonuses', () => {
        const source = character();
        const original = structuredClone(source);
        const bonus: EquipType['explicitBonus'][number] = {
            bonusFullName: allFullNameBonusList.VALOR_DE_ATAQUE, bonusRef: 'ad', bonusValue: 25,
            category: { type: 'generic', tier: 1 }, origin: 'random',
            effects: { type: 'stat_modifiers', target: ['general.ad'], operation: 'flat' },
        };
        source.inventario = [stored('new', { explicitBonus: [bonus] })];
        source.equipo_options.equipo2_on = true;
        const expected = (equipment: EquipType[]) => calculator.updateStats(
            source.stats, source.raza, equipment, source.atributos, source.buffos, source.lv, source.especialidad,
        ).stats;
        const { character: equipped } = service.equipItem(source, 'new');
        expect(equipped.stats).toEqual(expected(equipped.equipo_1));
        expect(equipped.stats.general.ad.min).toBeGreaterThan(expected([]).general.ad.min);
        expect(equipped.atributos).toEqual(source.atributos);
        expect(service.selectEquipment(equipped, 1).character.stats).toEqual(equipped.stats);
        const { character: inactive } = service.selectEquipment(equipped, 2);
        expect(inactive.stats).toEqual(expected([]));
        const { character: active } = service.selectEquipment(inactive, 1);
        expect(active.stats).toEqual(equipped.stats);
        const { character: unequipped } = service.unequipItem(active, 'arma');
        expect(unequipped.stats).toEqual(expected([]));
        const replacementSource = structuredClone(equipped);
        replacementSource.inventario = [stored('replacement')];
        const { character: replaced } = service.equipItem(replacementSource, 'replacement');
        expect(replaced.stats).toEqual(expected([]));
        expect(source.stats).toEqual(original.stats);
        expect(source.atributos).toEqual(original.atributos);
    });

    it('rebuilds attribute bonuses when reselecting, switching sets and unequipping', () => {
        const source = character();
        const bonus: EquipType['explicitBonus'][number] = {
            bonusFullName: allFullNameBonusList.STR, bonusRef: 'STR', bonusValue: 5,
            category: { type: 'generic', tier: 1 }, origin: 'random',
            effects: { type: 'attribute_modifier', target: 'atribute.STR.bonusPoints', operation: 'flat' },
        };
        source.inventario = [stored('new', { explicitBonus: [bonus] })];
        source.equipo_options.equipo2_on = true;
        const equipped = service.equipItem(source, 'new').character;
        expect(equipped.atributos.STR.bonusPoints).toBe(5);
        expect(service.selectEquipment(equipped, 1).character).toEqual(equipped);
        const inactive = service.selectEquipment(equipped, 2).character;
        expect(inactive.atributos.STR.bonusPoints).toBe(0);
        const active = service.selectEquipment(inactive, 1).character;
        expect(active.atributos).toEqual(equipped.atributos);
        expect(active.stats).toEqual(equipped.stats);
        expect(service.unequipItem(active, 'arma').character.atributos.STR.bonusPoints).toBe(0);
        expect(source.atributos.STR.bonusPoints).toBe(0);
    });

    it('returns inventory deltas for a swap and an unequip that reconstruct the final inventory', () => {
        const source = character();
        source.equipo_1 = [{ ...equipment({ name: 'Anterior', upgradeLv: 4 }), id: 'old' } as EquipType];
        const swap = service.equipItem(source, 'new');
        expect(swap.updatedItems).toEqual([{ id: 'new' }]);
        expect(swap.newItems).toEqual(swap.character.inventario);
        expect(swap.newItems).toHaveLength(1);
        expect(swap.newItems[0]).toMatchObject({ id: 'old', name: 'Anterior', upgradeLv: 4, position: { row: 0, col: 0 } });
        const clientInventory = source.inventario.filter(item =>
            !swap.updatedItems.some(change => change.id === item.id));
        clientInventory.push(...swap.newItems);
        expect(clientInventory).toEqual(swap.character.inventario);

        const unequip = service.unequipItem(swap.character, 'arma');
        expect(unequip.updatedItems).toEqual([]);
        expect(unequip.newItems).toHaveLength(1);
        expect(unequip.newItems[0]).toMatchObject({ id: 'new', position: { row: 0, col: 1 } });
        expect([...clientInventory, ...unequip.newItems]).toEqual(unequip.character.inventario);
        // Los deltas no comparten referencias con el snapshot del personaje.
        unequip.newItems[0].name = 'Modificado por el consumidor';
        expect(unequip.character.inventario[1].name).toBe('Espada');
    });

    it('returns the generated inventory instance ID and position when unequipping legacy equipment', () => {
        const source = character();
        source.equipo_1 = [equipment({ name: 'Legacy' })];
        const result = service.unequipItem(source, 'arma');
        expect(result.updatedItems).toEqual([]);
        expect(result.newItems).toEqual([result.character.inventario[1]]);
        expect(result.newItems[0]).toMatchObject({ id: expect.any(String), name: 'Legacy', position: { row: 0, col: 1 } });
    });

    it('returns inventory changes from the entity operations with the same instance IDs', () => {
        const source = character();
        const entity = mapper.toDomain(structuredClone(source));
        expect(entity.equipItemFromInventory('new')).toEqual({ newItems: [], updatedItems: [{ id: 'new' }] });
        const changes = entity.unequipItemToInventory('arma');
        expect(changes.updatedItems).toEqual([]);
        expect(changes.newItems).toEqual(entity.toPrimitives().inventario);
        expect(changes.newItems[0].id).toBe('new');
        changes.newItems[0].name = 'Otro nombre';
        expect(entity.toPrimitives().inventario[0].name).toBe('Espada');
    });

    it('rejects invalid duplicate equipment slots without losing any item', () => {
        const source = character();
        source.equipo_1 = [equipment(), equipment()];
        const original = structuredClone(source);
        expect(() => service.equipItem(source, 'new')).toThrow('más de un ítem');
        expect(source).toEqual(original);
    });
});
