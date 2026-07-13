import { Test, TestingModule } from '@nestjs/testing';
import { GameDatasService } from './game-datas.service';

describe('GameDatasService', () => {
  let service: GameDatasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameDatasService],
    }).compile();

    service = module.get<GameDatasService>(GameDatasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
