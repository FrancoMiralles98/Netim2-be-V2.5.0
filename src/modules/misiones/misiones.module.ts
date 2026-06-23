import { Module } from '@nestjs/common';
import { MisionesService } from './misiones.service';
import { MisionesController } from './misiones.controller';

@Module({
  controllers: [MisionesController],
  providers: [MisionesService],
})
export class MisionesModule {}
