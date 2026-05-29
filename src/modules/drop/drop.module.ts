import { Module } from '@nestjs/common';
import { DropService } from './drop.service';
import { DropController } from './drop.controller';

@Module({
  controllers: [DropController],
  providers: [DropService],
})
export class DropModule {}
