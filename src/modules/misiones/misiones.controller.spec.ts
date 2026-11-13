import { Test } from '@nestjs/testing';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MisionesController } from './misiones.controller';
import { MissionOrchestratorService } from './services/mission-orchestrator.service';

describe('MisionesController', () => {
    it('registra el controller autenticado con el orquestador de misiones', async () => {
        const module = await Test.createTestingModule({
            controllers: [MisionesController],
            providers: [{ provide: MissionOrchestratorService, useValue: {} }],
        }).overrideGuard(AccessTokenGuard).useValue({ canActivate: () => true }).compile();
        expect(module.get(MisionesController)).toBeDefined();
        await module.close();
    });
});
