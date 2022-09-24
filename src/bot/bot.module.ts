import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { CostsModule } from '../costs/costs.module';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [CostsModule, CurrencyModule],
  providers: [BotService],
})
export class BotModule {}
