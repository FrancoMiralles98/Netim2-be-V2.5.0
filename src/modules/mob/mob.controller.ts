import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobService } from './mob.service';
import { CreateMobDto } from './dto/create-mob.dto';
import { UpdateMobDto } from './dto/update-mob.dto';

@Controller('mob')
export class MobController {
  constructor(private readonly mobService: MobService) {}

  @Post()
  create(@Body() createMobDto: CreateMobDto) {
    return this.mobService.create(createMobDto);
  }

  @Get()
  findAll() {
    return this.mobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMobDto: UpdateMobDto) {
    return this.mobService.update(+id, updateMobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobService.remove(+id);
  }
}
