import { IdItem, IdMob, type ItemDTO } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../character/const/characterProps/base-character-stats.const';
import { ITEM_LIST } from '../item/const/items.const';
import { POCION_LIST } from '../item/const/miscs/pocion/pocion-list.const';
import type { ItemService } from '../item/item.service';
import { MobFactory } from '../mob/factory/mob.factory';
import { RngService } from '../shared/services/rng.service';
import { DropService } from './drop.service';
import type { EquipItemDropService } from './service/equipment-item-drop.service';
import { ItemDropService } from './service/item-drop.service';
import { MicsBonusService } from './service/miscs-bonus.service';
import { MobDropPreviewService } from './service/mob-drop-preview.service';
import { UtilityItemDropService } from './service/utility-item-drop.service';
import { ESPADA_LIST } from '../item/const/equip/weapons/espada-list.const';

jest.mock('../item/const/items.const', () => ({ ITEM_LIST: [] }));

describe('DropService', () => {
    const rng = new RngService();
    const miscs = new MicsBonusService(rng);
    const mob = new MobFactory().create({
        idMob: IdMob.PERRO_SALVAJE, nombre: 'Perro Salvaje', raza: 'perro', target_type: 'animales',
        ubication: 'city1', discovery: 1, hab: [], spawnConfig: { canSpawn: false },
        lv: 1, enemie_type: 'mob', dificultad: 1, specific_drop: [],
        exp: { min: 10, max: 25 }, yang: { min: 10, max: 20 },
    });
    const bonus = GENERAL_CHARACTER_STATS.bonus.miscs;
    const potion: ItemDTO = {
        ...POCION_LIST[0],
        itemDropConfig: {
            source: ['mob_drop'], drop_tag: ['generic_utility'], mobLv: { min: 1, max: 10 }, weight: 'COMMON',
        },
    };
    const items = { getCoreItemInfoByIdItem: jest.fn(() => structuredClone(potion)) };
    const utilityDrop = new UtilityItemDropService(rng);
    const itemDrop = new ItemDropService({} as EquipItemDropService, utilityDrop, rng, miscs,
        items as unknown as ItemService);
    const service = new DropService(rng, miscs, itemDrop);

    afterEach(() => {
        ITEM_LIST.length = 0;
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it('vuelve a sortear una categoría vacía y genera el ítem de la siguiente categoría', () => {
        ITEM_LIST.push(potion);
        jest.spyOn(Math, 'random')
            .mockReturnValueOnce(0) // Un intento.
            .mockReturnValueOnce(0.99) // Ítem.
            .mockReturnValue(0); // Equipo vacío, utilidad, poción y EXP mínima.

        expect(service.generateMobDrop(mob, bonus)).toEqual({
            items: [expect.objectContaining({ idItem: IdItem.POCION_ROJA_P, cantidad: 1 })],
            exp: 10,
            yang: 0,
        });
    });

    it('conserva el yang acumulado y sortea entre yang y nada al agotar las categorías', () => {
        jest.spyOn(Math, 'random')
            .mockReturnValueOnce(0.3) // Dos intentos.
            .mockReturnValueOnce(0.7) // Yang en el primer intento.
            .mockReturnValueOnce(0) // Yang mínimo.
            .mockReturnValueOnce(0.99) // Ítem en el segundo intento.
            .mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(0)
            .mockReturnValueOnce(0.99) // Yang en la tirada sin ítem.
            .mockReturnValue(0); // Yang y EXP mínimos.

        expect(service.generateMobDrop(mob, bonus)).toEqual({ items: [], exp: 10, yang: 20 });
        expect(items.getCoreItemInfoByIdItem).not.toHaveBeenCalled();
    });

    it('combina categorías, excluye las vacías y devuelve el rango real sin sortear', () => {
        const scaledPotion: ItemDTO = {
            ...potion,
            itemDropConfig: {
                source: ['mob_drop'], drop_tag: ['generic_utility'], mobLv: { min: 1, max: 10 }, weight: 'COMMON',
                quantity: { min: 1, max: 20, scaleWithMobLv: true },
                levelScaling: { startLv: 5, maxBonusLv: 10, maxMultiplier: 1.3 },
            },
        };
        const sword: ItemDTO = { ...ESPADA_LIST[0], itemDropConfig: {
            source: ['mob_drop'], drop_tag: ['equipment'], mobLv: { min: 1, max: 10 }, weight: 'UNCOMMON',
        } };
        ITEM_LIST.push(scaledPotion, sword);
        const itemService = { getCoreItemInfoByIdItem: (id: number) =>
            structuredClone(ITEM_LIST.find(item => item.idItem === id)) } as unknown as ItemService;
        const preview = new MobDropPreviewService(itemDrop, utilityDrop, miscs, itemService);
        const random = jest.spyOn(Math, 'random');

        const previewMob = { ...mob, lv: 10, specific_drop: [potion.idItem] };
        const drops = preview.getMobDropPreview(previewMob, {
            ...bonus, chances_objetos: 100, chances_raros: 100,
        });
        const utility = drops.find(drop => drop.type === 'utility');
        const equipment = drops.find(drop => drop.type === 'equip');
        expect(drops).toHaveLength(3);
        expect(utility).toMatchObject({ item: scaledPotion, quantityRange: { min: 1, max: 26 },
            chanceChange: 'increased', dropWeight: 'COMMON' });
        const perAttempt = (30 / 105) * (90 / 130);
        expect(utility?.chancePerAttempt).toBeCloseTo(perAttempt * 100);
        expect(utility?.chancePerKill).toBeCloseTo(
            [1, 2, 3, 4].reduce((sum, count) => sum + 1 - (1 - perAttempt) ** count, 0) * 25,
        );
        expect(equipment).toMatchObject({ item: sword,
            upgradeLvRange: { min: sword.upgradeLv, max: sword.upgradeLv }, dropWeight: 'UNCOMMON' });
        const rareDrops = preview.getMobDropPreview(previewMob, { ...bonus, chances_raros: 100 });
        expect(rareDrops.find(drop => drop.type === 'equip')?.chanceChange).toBe('decreased');
        expect(preview.getMobDropPreview(previewMob, bonus).map(drop => drop.chanceChange))
            .toEqual(['unchanged', 'unchanged', 'unchanged']);
        const blockedDrops = preview.getMobDropPreview(previewMob, { ...bonus, chances_objetos: -100 });
        expect(blockedDrops.filter(drop => drop.type !== 'yang')).toHaveLength(2);
        expect(blockedDrops.filter(drop => drop.type !== 'yang')).toEqual(Array(2).fill(expect.objectContaining({
            chancePerAttempt: 0, chancePerKill: 0, chanceChange: 'decreased',
        })));
        expect(random).not.toHaveBeenCalled();
    });

    it('calcula el yang base y su cambio cuando los bonus alteran los pesos de drop', () => {
        ITEM_LIST.push(potion);
        const preview = new MobDropPreviewService(itemDrop, utilityDrop, miscs, items as unknown as ItemService);
        const base = preview.getMobDropPreview(mob, bonus).find(drop => drop.type === 'yang')!;
        expect(base.chancePerAttempt).toBeCloseTo(100 * 15 / 90);
        expect(base.chanceChange).toBe('unchanged');
        const increased = preview.getMobDropPreview(mob, { ...bonus, chances_yang: 100 }).find(drop => drop.type === 'yang')!;
        expect(increased.chancePerAttempt).toBeCloseTo(100 * 30 / 105);
        expect(increased.chanceChange).toBe('increased');
        const decreased = preview.getMobDropPreview(mob, { ...bonus, chances_objetos: 100 }).find(drop => drop.type === 'yang')!;
        expect(decreased.chanceChange).toBe('decreased');
        expect(base.chancePerKill).toBeCloseTo(
            [1, 2, 3, 4].reduce((sum, count) => sum + 1 - (1 - 15 / 90) ** count, 0) * 25,
        );
    });

    it('incluye el yang de la tirada alternativa cuando todas las categorías están vacías', () => {
        const preview = new MobDropPreviewService(itemDrop, utilityDrop, miscs, items as unknown as ItemService);
        const drops = preview.getMobDropPreview(mob, bonus);
        expect(drops).toHaveLength(1);
        expect(drops[0]).toMatchObject({ type: 'yang', chanceChange: 'unchanged' });
        expect(drops[0].chancePerAttempt).toBeCloseTo(20);
        const boosted = preview.getMobDropPreview(mob, { ...bonus, chances_objetos: 100 });
        expect(boosted[0].chancePerAttempt).toBeCloseTo(20);
        expect(boosted[0].chanceChange).toBe('unchanged');
    });
});
