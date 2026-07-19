import { Test, TestingModule } from '@nestjs/testing';
import { GameDatasController } from './game-datas.controller';
import { GameDatasService } from './game-datas.service';

describe('GameDatasController', () => {
  let controller: GameDatasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameDatasController],
      providers: [GameDatasService],
    }).compile();

    controller = module.get<GameDatasController>(GameDatasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
