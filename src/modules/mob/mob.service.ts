import { Injectable } from '@nestjs/common';
import { CreateMobDto } from './dto/create-mob.dto';
import { UpdateMobDto } from './dto/update-mob.dto';

@Injectable()
export class MobService {
  create(createMobDto: CreateMobDto) {
    return 'This action adds a new mob';
  }

  findAll() {
    return `This action returns all mob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mob`;
  }

  update(id: number, updateMobDto: UpdateMobDto) {
    return `This action updates a #${id} mob`;
  }

  remove(id: number) {
    return `This action removes a #${id} mob`;
  }
}
