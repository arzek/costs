import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CostDocument = Cost & Document;

@Schema()
export class Cost {
  @Prop()
  price: number;

  @Prop()
  group: string;

  @Prop()
  date: Date;
}

export const CostsSchema = SchemaFactory.createForClass(Cost);
