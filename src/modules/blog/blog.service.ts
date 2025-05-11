import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import elasticClient from 'src/config/elasticSearch.client';
import { BlogDto } from './dto/blog.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class BlogService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  async createBlog(data: BlogDto) {
    const { title, content } = data;

    if (!title || !content) {
      this.logger.warn('Missing required fields in createBlog');
      throw new BadRequestException('fields are required');
    }

    try {
      const result = await elasticClient.index({
        index: 'blog',
        document: { title, content },
      });

      this.logger.log(`Blog created successfully: ${result._id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating blog`, { error });
      throw new Error(`Error creating blog: ${error.message}`);
    }
  }

  async getBlogs() {
    this.logger.log('Fetching all blogs from Elasticsearch...');

    try {
      const result = await elasticClient.search({
        index: 'blog',
        query: {
          match_all: {},
        },
        size: 1000,
      });

      const blogs = result.hits.hits.map((hit) => ({
        id: hit._id,
        ...(hit._source as { [key: string]: any }),
      }));

      this.logger.log(`Successfully fetched ${blogs.length} blogs`);

      return blogs;
    } catch (error) {
      this.logger.error('Error fetching blogs', error.stack);
      throw new Error(`Error fetching blogs: ${error.message}`);
    }
  }
  async getBlogByValue(value: string) {
    if (!value) {
      throw new BadRequestException('Search value is required');
    }

    try {
      const result = await elasticClient.search({
        index: 'blog',
        q: value,
      });

      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      throw new Error(`Error fetching blog by value: ${error}`);
    }
  }
  async getByMultipleFields(search: string) {
    const cleanSearch = search.trim();
    if (!cleanSearch) {
      throw new BadRequestException('query is required');
    }
    try {
      const result = await elasticClient.search({
        index: 'blog',
        query: {
          multi_match: {
            query: cleanSearch,
            fields: ['title', 'content'],
          },
        },
      });
      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      throw new Error(`Error fetching blog by multiple fields: ${error}`);
    }
  }
  async updateBlog(id: string, data: BlogDto) {
    if (!id) throw new BadRequestException('id is required');

    Object.keys(data).forEach((key) => {
      if (!data[key]) delete data[key];
    });

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('data is invalid');
    }

    try {
      const result = await elasticClient.update({
        index: 'blog',
        id,
        doc: data,
        doc_as_upsert: true,
      });
      return result;
    } catch (error) {
      throw new Error(`Error updating blog: ${error}`);
    }
  }
}
