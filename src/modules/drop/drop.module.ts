import { Module } from '@nestjs/common';
import { DropService } from './drop.service';
import { DropController } from './drop.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [DropController],
  providers: [DropService],
})
export class DropModule {}
