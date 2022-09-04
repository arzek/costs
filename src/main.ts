import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { CostsService } from './costs/costs.service';

import * as CC from 'currency-converter-lt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = await app.get<ConfigService>(ConfigService);
  const costsService = await app.get<CostsService>(CostsService);

  const bot = new Telegraf(configService.get('TELEGRAM_BOT_TOKEN'));

  let currencyConverter = new CC({
    from: 'IDR',
    to: 'USD',
    amount: 1,
  });
  const idr2usdRate = await currencyConverter.convert();

  currencyConverter = new CC({
    from: 'USD',
    to: 'UAH',
    amount: 1,
  });
  const usd2uahRate = await currencyConverter.convert();

  bot.on('text', async (ctx) => {
    const [price, group] = ctx.message.text.split(' ');

    await costsService.add(
      Number(price),
      group,
      new Date(ctx.message.date * 1000),
    );

    const result = await costsService.getStatistics();

    let reply = 'Успішно додано! Статистика за місяць: \n\n';

    let allCosts = 0;
    for (const item of result) {
      const idr = item.count * 1000;

      reply += `${item._id} ${idr} IDR/ ${idr2usd(idr)} USD / ${idr2uah(
        idr,
      )} грн. \n`;
      allCosts += idr;
    }

    reply += `\n Всього витрачено: ${allCosts} IDR/ ${idr2usd(
      allCosts,
    )} USD / ${idr2uah(allCosts)} грн.`;
    ctx.reply(reply);
  });

  await bot.launch();

  function idr2usd(idr: number): string {
    return (idr * idr2usdRate).toFixed(2);
  }

  function idr2uah(idr: number): string {
    return (idr * idr2usdRate * usd2uahRate).toFixed(2);
  }
}

bootstrap();
