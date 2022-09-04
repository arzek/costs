import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { CostsService } from './costs/costs.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = await app.get<ConfigService>(ConfigService);
  const costsService = await app.get<CostsService>(CostsService);

  const bot = new Telegraf(configService.get('TELEGRAM_BOT_TOKEN'));

  bot.on('text', async (ctx) => {
    const [price, group] = ctx.message.text.split(' ');

    await costsService.add(
      Number(price),
      group,
      new Date(ctx.message.date * 1000),
    );

    ctx.reply('Успішно додано!');
  });

  await bot.launch();
}
bootstrap();
