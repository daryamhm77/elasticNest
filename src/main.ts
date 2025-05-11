import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { instance } from './logger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance }),
  });

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  logger.log(`🚀 App is running on http://localhost:${PORT}`);
}
bootstrap();
