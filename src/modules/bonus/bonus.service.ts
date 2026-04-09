import { Injectable } from '@nestjs/common';

@Injectable()
export class BonusService {
  create(createBonusDto: any) {
    return 'This action adds a new bonus';
  }

  findAll() {
    return `This action returns all bonus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bonus`;
  }

  update(id: number, updateBonusDto: any) {
    return `This action updates a #${id} bonus`;
  }

  remove(id: number) {
    return `This action removes a #${id} bonus`;
  }
}
