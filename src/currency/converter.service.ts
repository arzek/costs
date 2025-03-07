import { Injectable } from '@nestjs/common';
import * as CC from 'currency-converter-lt';
import axios from 'axios';

@Injectable()
export class ConverterService {
  private idr2usdRate = 0;
  private usd2uahRate = 0;

  async setRate(): Promise<void> {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
    );

    this.idr2usdRate = response.data.rates.IDR;
    this.usd2uahRate = response.data.rates.UAH;
  }

  idr2usd(idr: number): string {
    return (idr * this.idr2usdRate).toFixed(0) === '0'
      ? (idr * this.idr2usdRate).toFixed(2)
      : (idr * this.idr2usdRate).toFixed(0);
  }

  idr2uah(idr: number): string {
    return (
      ((idr * this.idr2usdRate * this.usd2uahRate) / 1000).toFixed(0) + 'k'
    );
  }

  printIDR(idr: number): string {
    return (idr / 1000).toLocaleString() + 'k';
  }
}
