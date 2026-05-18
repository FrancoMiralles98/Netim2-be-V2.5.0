import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { RngService } from './services/rng.service';

@Module({
  controllers: [SharedController],
  providers: [
    SharedService,
    RngService
  ],
  exports: [
    RngService
  ]
})
export class SharedModule {}
