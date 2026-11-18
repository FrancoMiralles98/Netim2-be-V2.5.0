import { Module } from '@nestjs/common';
import { MobService } from './mob.service';
import { MobController } from './mob.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MobModel, mobSchema } from './schema/mob.schema';
import { MobRepository } from './repository/mob.repository';
import { AuthModule } from '../auth/auth.module';
import { DropModule } from '../drop/drop.module';
import { MobFactory } from './factory/mob.factory';
import { MobInfoService } from './services/mob-info.service';
import { MobOrchestratorService } from './services/mob-orchestrator.service';

@Module({
  imports: [
    AuthModule,
    DropModule,
    MongooseModule.forFeature([
      { name: MobModel.name, schema: mobSchema }
    ])
  ],
  controllers: [MobController],
  providers: [MobService, MobRepository, MobFactory, MobInfoService, MobOrchestratorService],
  exports: [
    MobService,
    MobInfoService
  ]
})
export class MobModule { }
