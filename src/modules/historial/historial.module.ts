import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialModel, historialSchema } from './schema/historial.schema';
import { HistorialRepository } from './repository/historial-respository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: HistorialModel.name, schema: historialSchema}
    ])
  ],
  controllers: [HistorialController],
  providers: [
    HistorialService,
    HistorialRepository
  ],
  exports: [
    HistorialService
  ]
})
export class HistorialModule {}
