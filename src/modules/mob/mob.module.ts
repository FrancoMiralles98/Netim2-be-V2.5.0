import { Module } from '@nestjs/common';
import { MobService } from './mob.service';
import { MobController } from './mob.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MobModel, mobSchema } from './schema/mob.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MobModel.name, schema: mobSchema }
    ])
  ],
  controllers: [MobController],
  providers: [MobService],
  exports: [
    MobService
  ]
})
export class MobModule { }
