import { Test, TestingModule } from '@nestjs/testing';
import { DropController } from './drop.controller';
import { DropService } from './drop.service';

describe('DropController', () => {
  let controller: DropController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropController],
      providers: [DropService],
    }).compile();

    controller = module.get<DropController>(DropController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
