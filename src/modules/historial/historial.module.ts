import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialModel, historialSchema } from './schema/historial.schema';
import { HistorialRepository } from './repository/historial-respository';
import { AuthModule } from '../auth/auth.module';
import { CharacterModel, characterSchema } from '../character/schema/character.schema';
import { HistorialQueryService } from './services/historial-query.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: HistorialModel.name, schema: historialSchema},
      {name: CharacterModel.name, schema: characterSchema},
    ])
  ],
  controllers: [HistorialController],
  providers: [
    HistorialService,
    HistorialQueryService,
    HistorialRepository
  ],
  exports: [
    HistorialService
  ]
})
export class HistorialModule {}
