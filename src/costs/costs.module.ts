import { Module } from '@nestjs/common';
import { CostsService } from './costs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cost, CostsSchema } from './costs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cost.name, schema: CostsSchema }]),
  ],
  providers: [CostsService],
  exports: [CostsService],
})
export class CostsModule {}
