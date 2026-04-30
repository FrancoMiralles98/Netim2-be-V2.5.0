import { Test, TestingModule } from '@nestjs/testing';
import { MobController } from './mob.controller';
import { MobService } from './mob.service';

describe('MobController', () => {
  let controller: MobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobController],
      providers: [MobService],
    }).compile();

    controller = module.get<MobController>(MobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
