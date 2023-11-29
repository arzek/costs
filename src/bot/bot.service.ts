import { Injectable } from '@nestjs/common';
import { CostsService } from '../costs/costs.service';
import { ConverterService } from '../currency/converter.service';

@Injectable()
export class BotService {
  constructor(
    private readonly costsService: CostsService,
    private readonly converterService: ConverterService,
  ) {}

  async text(ctx) {
    const [price, group] = ctx.message.text.split(' ');

    if (isNaN(price)) {
      return;
    }

    if (!this.isEmoji(group)) {
      return;
    }

    await this.costsService.add(
      Number(price),
      group.trim(),
      new Date(ctx.message.date * 1000),
    );

    const result = await this.costsService.getStatistics();

    let reply = 'Added successfully! Statistics for the month: \n\n';

    let allCosts = 0;
    for (const [index, item] of result.entries()) {
      allCosts += item.count * 1000;
    }

    let idrLength = 0;
    let usdLength = 0;
    let uahLength = 0;

    for (const [index, item] of result.entries()) {
      const idr = item.count * 1000;

      if (!idrLength) {
        idrLength = this.converterService.printIDR(idr).length;
      }

      if (!usdLength) {
        usdLength = this.converterService.idr2usd(idr).length;
      }

      if (!uahLength) {
        uahLength = this.converterService.idr2uah(idr).length;
      }

      reply += `${
        index + 1 <= 9 ? '0' + (index + 1) : index + 1
      }. ${this.capitalizeFirstLetter(
        item._id,
      )}: ${this.converterService.printIDR(
        idr,
      )} IDR | ${this.converterService.idr2usd(idr)} USD | ${this.getPercents(
        allCosts,
        idr,
      )} \n`;
    }

    reply += `\n Total spent: **${this.converterService.printIDR(
      allCosts,
    )} IDR** | **${this.converterService.idr2usd(allCosts)}\n`;

    reply += `\n Chart - https://loquacious-cobbler-a12ef7.netlify.app/`;

    ctx.reply(reply);
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private getPercents(allCosts, price): string {
    return ((price / allCosts) * 100).toFixed(2) + '%';
  }

  private isEmoji(str: string): boolean {
    const emojiRegex = /[\p{Emoji}]/gu;
    return emojiRegex.test(str);
  }
}
