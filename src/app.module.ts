import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexModule } from './modules/index/index.module';
import { BlogModule } from './modules/blog/blog.module';
import { WinstonModule } from 'nest-winston';
import { instance as winstonLogger } from './logger.config';
@Module({
  imports: [
    WinstonModule.forRoot({ instance: winstonLogger }),
    IndexModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
