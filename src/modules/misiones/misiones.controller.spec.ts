import { Test, TestingModule } from '@nestjs/testing';
import { MisionesController } from './misiones.controller';
import { MisionesService } from './misiones.service';

describe('MisionesController', () => {
  let controller: MisionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MisionesController],
      providers: [MisionesService],
    }).compile();

    controller = module.get<MisionesController>(MisionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
