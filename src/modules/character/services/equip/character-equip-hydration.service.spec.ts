import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { BonusInItem, EquipType, IdItem, InventoryItem } from 'netim2-shared';
import { ItemModule } from '../../../item/item.module';
import { ItemService } from '../../../item/item.service';
import { ITEM_LIST } from '../../../item/const/items.const';
import { BonusSharedService } from '../../../shared/services/bonus-shared.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { UserService } from '../../../user/user.service';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterEquipService } from './character-equip.service';
import { CharacterEquipOrchestratorService } from './character-equip-orchestrator.service';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';

describe('Equipment with real item hydration and stat calculators', () => {
    let module: TestingModule;
    let service: CharacterEquipService;
    let items: ItemService;
    let bonuses: BonusSharedService;
    const repository = { getCharacterById: jest.fn(), updateCharacterById: jest.fn() };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ItemModule],
            providers: [
                CharacterMapper, CharacterEquipService, CharacterEquipOrchestratorService,
                UpdateStatsService, CharacterLevelScalingService, CharacterAttributesService,
                EquipStatsCalculatorService, BuffStatsCalculatorService, LimitBonusService,
                { provide: CharacterRepository, useValue: repository },
                { provide: UserService, useValue: {} },
                { provide: getConnectionToken(), useValue: {} },
            ],
        }).compile();
        service = module.get(CharacterEquipService);
        items = module.get(ItemService);
        bonuses = module.get(BonusSharedService);
    });

    afterAll(async () => { await module.close(); });
    beforeEach(() => { jest.clearAllMocks(); });

    function sword(explicitBonus: BonusInItem[] = []): InventoryItem & EquipType {
        const base = structuredClone(ITEM_LIST.find(item => item.idItem === IdItem.ESPADA)) as EquipType;
        return {
            ...base, id: 'sword-instance', position: { row: 0, col: 0 }, upgradeLv: 5,
            implicitBonus: [], randomImplicitBonus: [], explicitBonus,
        };
    }

    function character(item = sword()) {
        const source = structuredClone(GENERAL_CHARACTER);
        source.lv = 10;
        source.inventario = [item];
        source.equipo_options = { equipo1_on: true, equipo2_on: true, equipo3_on: true };
        return source;
    }

    it.each([1, 2, 3] as const)('hydrates and persists implicits and explicit stats together in set %i', async slot => {
        const explicit = [bonuses.transformToBonusInItem('hp', 130, 'random')];
        const source = character(sword(explicit));
        source.equipo_selected = slot;
        const original = structuredClone(source);
        repository.getCharacterById.mockResolvedValue({ ...source, user_owner: 'owner' });
        repository.updateCharacterById.mockResolvedValue(undefined);
        const baseline = service.selectEquipment(character(), slot).character;
        const response = await module.get(CharacterEquipOrchestratorService).equipItem('character', 'owner', 'sword-instance');
        const key = ({ 1: 'equipo_1', 2: 'equipo_2', 3: 'equipo_3' } as const)[slot];
        expect(response.equippedItem.implicitBonus.length).toBeGreaterThan(0);
        expect(response.equippedItem.explicitBonus).toEqual(explicit);
        expect(response.equippedItem.upgradeLv).toBe(5);
        expect(response.equippedItem).not.toHaveProperty('position');
        expect(response.stats.general.ad.min).toBeGreaterThan(baseline.stats.general.ad.min);
        expect(response.stats.general.hp.max).toBe(baseline.stats.general.hp.max + 130);
        expect(repository.updateCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', expect.objectContaining({
            [key]: [response.equippedItem], inventario: [], stats: response.stats,
        }));
        expect(source).toEqual(original);
    });

    it('uses the saved upgrade and preserves random bonus identities without rerolling', () => {
        const saved = sword();
        saved.randomImplicitBonus = [bonuses.transformToBonusInItem('critico', 0, 'random')];
        const original = structuredClone(saved);
        const updated = items.getUpdatedInventoryItem(saved) as InventoryItem & EquipType;
        const unupgraded = items.getUpdatedInventoryItem({ ...saved, upgradeLv: 0 }) as InventoryItem & EquipType;
        expect(updated.implicitBonus).not.toEqual(unupgraded.implicitBonus);
        expect(updated.randomImplicitBonus.map(bonus => bonus.bonusRef)).toEqual(['critico']);
        expect(updated.randomImplicitBonus[0].bonusValue).toBeGreaterThan(0);
        expect(items.getUpdatedInventoryItem(updated)).toEqual(updated);
        expect(saved).toEqual(original);
        const equipped = service.equipItem(character(saved), saved.id).character;
        expect(equipped.equipo_1[0].implicitBonus).toEqual(updated.implicitBonus);
        expect(equipped.equipo_1[0].randomImplicitBonus).toEqual(updated.randomImplicitBonus);
    });

    it('applies explicit flat, percentage and attribute bonuses without accumulating on selection', () => {
        const flat = bonuses.transformToBonusInItem('ad', 20, 'random');
        const percentage: BonusInItem = {
            ...flat, bonusValue: 10,
            effects: { type: 'stat_modifiers', target: ['general.ad'], operation: 'porcentage' },
        };
        const attributes = bonuses.transformToBonusInItem('STR', 5, 'random');
        const withoutPercentage = service.equipItem(character(sword([flat, attributes])), 'sword-instance').character;
        const equipped = service.equipItem(character(sword([flat, attributes, percentage])), 'sword-instance').character;
        expect(equipped.atributos.STR.bonusPoints).toBe(5);
        expect(equipped.stats.general.ad.min).toBe(Math.trunc(withoutPercentage.stats.general.ad.min * 1.1 * 10) / 10);
        expect(service.selectEquipment(equipped, 1).character.stats).toEqual(equipped.stats);
        const removed = service.unequipItem(equipped, 'arma');
        expect(removed.character.atributos.STR.bonusPoints).toBe(0);
        expect(removed.newItems[0]).toMatchObject({ id: 'sword-instance', explicitBonus: [flat, attributes, percentage] });
        expect(service.equipItem(removed.character, 'sword-instance').character.stats).toEqual(equipped.stats);
    });

    it('repairs stale active equipment before selection and before returning a replaced item', () => {
        const source = character();
        const { position, ...old } = sword();
        source.equipo_1 = [{ ...old, id: 'old-instance' } as EquipType];
        const selected = service.selectEquipment(source, 1).character;
        expect(selected.equipo_1[0].implicitBonus.length).toBeGreaterThan(0);
        const swapped = service.equipItem(source, 'sword-instance');
        expect(swapped.newItems[0]).toMatchObject({ id: 'old-instance', implicitBonus: selected.equipo_1[0].implicitBonus });
        expect(source.equipo_1[0].implicitBonus).toEqual([]);
    });

    it('applies the electric target of the starter explicit bonuses, independently of their display name', () => {
        const explicit = [13, 9].map(value => ({
            ...bonuses.transformToBonusInItem('ad', value, 'random'),
            bonusRef: 'electrico',
            effects: { type: 'stat_modifiers', target: ['bonus.daño.electrico'], operation: 'flat' },
        } as BonusInItem));
        const baseline = service.equipItem(character(), 'sword-instance').character;
        const result = service.equipItem(character(sword(explicit)), 'sword-instance').character;
        expect(result.stats.bonus.daño.electrico).toBe(baseline.stats.bonus.daño.electrico + 22);
        expect(result.stats.general.ad).toEqual(baseline.stats.general.ad);
    });
});
