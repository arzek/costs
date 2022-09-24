import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot/bot.service';
import { ConverterService } from './currency/converter.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.get<ConfigService>(ConfigService);
  const botService = await app.get<BotService>(BotService);
  const converterService = await app.get<ConverterService>(ConverterService);

  await converterService.setRate();

  const bot = new Telegraf(configService.get('TELEGRAM_BOT_TOKEN'));

  bot.on('text', async (ctx) => {
    await botService.text(ctx);
  });

  await app.listen(configService.get('PORT') || 3000, async () => {
    await bot.launch();
  });
}

bootstrap();
