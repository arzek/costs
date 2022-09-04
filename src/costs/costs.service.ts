import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cost, CostDocument } from './costs.schema';
import { Model } from 'mongoose';

@Injectable()
export class CostsService {
  constructor(
    @InjectModel(Cost.name) private readonly costModel: Model<CostDocument>,
  ) {}

  async add(price: number, group: string, date: Date): Promise<void> {
    await this.costModel.create({ price, group, date });
  }
}
