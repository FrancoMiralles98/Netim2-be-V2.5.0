import { Injectable } from '@nestjs/common';
import { Buff } from '../entities/buff.entity';
import { Caña } from '../entities/caña.entity';
import { Cebo } from '../entities/cebo.entity';
import { Equip } from '../entities/equip.entity';
import { ItemBase } from '../entities/item-base.entity';
import { Montura } from '../entities/montura.entity';
import { Piedra } from '../entities/piedra.entity';
import { Pocion } from '../entities/pocion.entity';
import { Utility } from '../entities/utility.entity';
import { ItemDTO } from '../types/item-dto';

@Injectable()
export class ItemFactory {
  create(data: ItemDTO): ItemBase {
    switch (data.type) {
      case 'utility':
        return this.createUtility(data);

      case 'equip':
        return new Equip(data);

      default:
        throw new Error(`unknow item type`);
    }
  }

  private createUtility(
    data: Extract<ItemDTO, { type: 'utility' }>,
  ): ItemBase {
    switch (data.type_utility) {
      case 'buff':
        return new Buff(data);
      case 'caña':
        return new Caña(data);
      case 'poción':
        return new Pocion(data);
      case 'cebo':
        return new Cebo(data);
      case 'piedra':
        return new Piedra(data);
      case 'montura':
        return new Montura(data);
      case 'utility':
        return new Utility(data);
      default:
        throw new Error(`unknow utility type type`);
    }
  }
}
