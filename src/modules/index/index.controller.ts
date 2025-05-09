import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { IndexService } from './index.service';
import { CreateIndexDto } from './dto/index.dto';

@Controller('index')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}
  @Post('create')
  createIndex(@Body() body: CreateIndexDto) {
    return this.indexService.createIndex(body.indexName);
  }
  @Get('indices')
  async getIndices() {
    return await this.indexService.getAllIndices();
  }
  @Delete('index/:indexName')
  async deleteIndex(@Param() indexName: string) {
    return await this.indexService.deleteIndex(indexName);
  }
}
