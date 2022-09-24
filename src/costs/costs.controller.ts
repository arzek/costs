import { Controller, Get } from '@nestjs/common';
import { CostsService } from './costs.service';
import { ConverterService } from '../currency/converter.service';

@Controller('costs')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly converterService: ConverterService,
  ) {}

  @Get('current-month')
  async currentMonth() {
    return (await this.costsService.getStatistics()).map((item) => {
      return {
        ...item,
        count: this.converterService.idr2usd(item.count * 1000),
      };
    });
  }
}
