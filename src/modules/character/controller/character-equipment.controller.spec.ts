import 'reflect-metadata';
import { ForbiddenException } from '@nestjs/common';
import { GUARDS_METADATA, METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { validate } from 'class-validator';
import { CharacterEquipmentController } from './character-equipment.controller';
import { CharacterEquipOrchestratorService } from '../services/equip/character-equip-orchestrator.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { BuyEquipmentSlotDto, EquipItemDto, SelectEquipmentDto, UnequipItemDto } from '../dto/character-equipment.dto';

// El orquestador está en desarrollo; estas pruebas verifican la frontera HTTP con un mock.
jest.mock('../services/equip/character-equip-orchestrator.service', () => ({ CharacterEquipOrchestratorService: class {} }));

describe('CharacterEquipmentController', () => {
  const request = { user: { accountId: 'account' } } as AuthRequest;
  const result = { stats: {} };
  let service: Record<string, jest.Mock>;
  let controller: CharacterEquipmentController;

  beforeEach(() => {
    service = {
      equipItem: jest.fn().mockResolvedValue(result),
      unequipItem: jest.fn().mockResolvedValue(result),
      selectEquipment: jest.fn().mockResolvedValue(result),
      buyEquipmentSlot: jest.fn().mockResolvedValue(result),
    };
    controller = new CharacterEquipmentController(service as unknown as CharacterEquipOrchestratorService);
  });

  it('registers the equipment prefix and the same authentication guard', () => {
    expect(Reflect.getMetadata(PATH_METADATA, CharacterEquipmentController)).toBe('character/:id/equipment');
    expect(Reflect.getMetadata(GUARDS_METADATA, CharacterEquipmentController)).toEqual([AccessTokenGuard]);
  });

  it.each([
    ['equipItem', { itemId: 'instance' }, ['character', 'account', 'instance'], 'equip'],
    ['unequipItem', { subType: 'arma' }, ['character', 'account', 'arma'], 'unequip'],
    ['selectEquipment', { slot: 2 }, ['character', 'account', 2], 'selected'],
    ['buyEquipmentSlot', { slot: 3 }, ['character', 'account', 3], 'slots/purchase'],
  ] as const)('delegates %s with the authenticated account and propagates service errors', async (method, body, args, path) => {
    const handler = controller[method] as (req: AuthRequest, id: string, body: unknown) => Promise<unknown>;
    expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe(path);
    expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBeDefined();
    expect(await handler.call(controller, request, 'character', body)).toEqual({ data: result });
    expect(service[method]).toHaveBeenCalledWith(...args);
    service[method].mockClear();
    service[method].mockRejectedValue(new ForbiddenException());
    await expect(handler.call(controller, request, 'character', body)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('validates instance IDs, equipment subtypes and numeric slots', async () => {
    expect(await validate(Object.assign(new EquipItemDto(), { itemId: 'instance' }))).toEqual([]);
    expect((await validate(Object.assign(new EquipItemDto(), { itemId: '' }))).length).toBeGreaterThan(0);
    expect((await validate(Object.assign(new UnequipItemDto(), { subType: 'invalid' }))).length).toBeGreaterThan(0);
    for (const Dto of [SelectEquipmentDto, BuyEquipmentSlotDto]) {
      expect(await validate(Object.assign(new Dto(), { slot: 2 }))).toEqual([]);
      for (const slot of [0, 4, '2', 1.5]) {
        expect((await validate(Object.assign(new Dto(), { slot }))).length).toBeGreaterThan(0);
      }
    }
  });
});
