import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from './dto/blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('create')
  createProduct(@Body() body: BlogDto) {
    return this.blogService.createBlog(body);
  }

  @Get('all')
  getAllProducts() {
    return this.blogService.getBlogs();
  }
  @Get('search/:value')
  search(@Param() value: string) {
    return this.blogService.getBlogByValue(value);
  }
  @Get('search-multi')
  searchMulti(@Query('search') search: string) {
    return this.blogService.getByMultipleFields(search);
  }
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: BlogDto) {
    return this.blogService.updateBlog(id, body);
  }
}
