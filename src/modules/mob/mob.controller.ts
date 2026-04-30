import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobService } from './mob.service';

@Controller('mob')
export class MobController {
  constructor(private readonly mobService: MobService) {}

}
