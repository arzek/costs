import { Module } from '@nestjs/common';
import { CostsService } from './costs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cost, CostsSchema } from './costs.schema';
import { CostsController } from './costs.controller';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cost.name, schema: CostsSchema }]),
    CurrencyModule,
  ],
  providers: [CostsService],
  exports: [CostsService],
  controllers: [CostsController],
})
export class CostsModule {}
