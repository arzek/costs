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

    for (const [index, item] of result.entries()) {
      const idr = item.count * 1000;

      reply += `${index + 1}. ${this.capitalizeFirstLetter(
        item._id,
      )}: ${this.converterService.printIDR(
        idr,
      )} IDR | ${this.converterService.idr2usd(idr)} USD | ${this.getPercents(
        allCosts,
        idr,
      )} \n`;
    }

    reply += `\n Total spent: <b>${this.converterService.printIDR(
      allCosts,
    )}</b> IDR | <b>${this.converterService.idr2usd(
      allCosts,
    )}</b> USD | <b>${this.converterService.idr2uah(allCosts)}</b> UAH \n`;

    reply += `\n <a href="https://loquacious-cobbler-a12ef7.netlify.app">Chart</a>`;

    ctx.reply(reply, { parse_mode: 'HTML' });
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private getPercents(allCosts, price): string {
    const amount = (price / allCosts) * 100;

    const percents = amount < 10 ? amount.toFixed(2) : amount.toFixed(0);
    return percents + '%';
  }

  private isEmoji(str: string): boolean {
    const emojiRegex = /[\p{Emoji}]/gu;
    return emojiRegex.test(str);
  }
}
