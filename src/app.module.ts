import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexModule } from './modules/index/index.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [IndexModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
