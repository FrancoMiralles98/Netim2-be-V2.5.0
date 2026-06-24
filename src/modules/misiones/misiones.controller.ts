import { Controller } from '@nestjs/common';
import { MisionesService } from './misiones.service';

@Controller('misiones')
export class MisionesController {
  constructor(private readonly misionesService: MisionesService) {}
}
