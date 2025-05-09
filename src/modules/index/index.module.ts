import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';

@Module({
  providers: [IndexService],
  controllers: [IndexController],
})
export class IndexModule {}
