import { Injectable } from '@nestjs/common';
import * as CC from 'currency-converter-lt';

@Injectable()
export class ConverterService {
  private idr2usdRate = 0;
  private usd2uahRate = 0;

  async setRate(): Promise<void> {
    let currencyConverter = new CC({
      from: 'IDR',
      to: 'USD',
      amount: 1,
    });
    this.idr2usdRate = await currencyConverter.convert();

    currencyConverter = new CC({
      from: 'USD',
      to: 'UAH',
      amount: 1,
    });
    this.usd2uahRate = await currencyConverter.convert();
  }

  idr2usd(idr: number): string {
    return (idr * this.idr2usdRate).toFixed(0);
  }

  idr2uah(idr: number): string {
    return (idr * this.idr2usdRate * this.usd2uahRate).toFixed(2);
  }

  printIDR(idr: number): string {
    return (idr / 1000).toLocaleString() + 'k';
  }
}
