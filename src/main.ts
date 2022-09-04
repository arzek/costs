import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = await app.get(ConfigService);
  const bot = new Telegraf(configService.get('TELEGRAM_BOT_TOKEN'));

  bot.on('text', (ctx) => {
    // Explicit usage

    // Using context shortcut
    ctx.reply(`Hello ${ctx.state.role}`);
  });

  await bot.launch();
}
bootstrap();
