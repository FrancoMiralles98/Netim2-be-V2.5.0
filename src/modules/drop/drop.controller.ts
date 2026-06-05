import { Controller } from '@nestjs/common';
import { DropService } from './drop.service';

@Controller('drop')
export class DropController {
  constructor(private readonly dropService: DropService) {}
}
