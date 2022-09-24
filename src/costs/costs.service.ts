import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cost, CostDocument } from './costs.schema';
import { Aggregate, Model } from 'mongoose';

@Injectable()
export class CostsService {
  constructor(
    @InjectModel(Cost.name) private readonly costModel: Model<CostDocument>,
  ) {}

  async add(price: number, group: string, date: Date): Promise<void> {
    await this.costModel.create({
      price,
      group,
      date,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  }

  getStatistics(): Aggregate<Array<any>> {
    return this.costModel.aggregate([
      {
        $match: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
      },
      {
        $group: {
          _id: '$group',
          count: { $sum: '$price' },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  }
}
