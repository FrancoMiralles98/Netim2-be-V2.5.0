import { Test, TestingModule } from '@nestjs/testing';
import { MobService } from './mob.service';

describe('MobService', () => {
  let service: MobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobService],
    }).compile();

    service = module.get<MobService>(MobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
