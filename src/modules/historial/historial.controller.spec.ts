import { Test } from '@nestjs/testing';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';

describe('HistorialController', () => {
    it('registra el controller con su servicio', async () => {
        const module = await Test.createTestingModule({
            controllers: [HistorialController],
            providers: [{ provide: HistorialService, useValue: {} }],
        }).compile();
        expect(module.get(HistorialController)).toBeDefined();
        await module.close();
    });
});
