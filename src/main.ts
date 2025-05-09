import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT = 3000 } = process.env;
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}
bootstrap();
