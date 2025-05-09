import { BadRequestException, Injectable } from '@nestjs/common';
import elasticClient from 'src/config/elasticSearch.client';
import { BlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  async createBlog(data: BlogDto) {
    const { title, content } = data;
    if (!title || !content) {
      throw new BadRequestException('fields are required');
    }
    try {
      const result = await elasticClient.index({
        index: 'blog',
        document: { title, content },
      });
      return result;
    } catch (error) {
      throw new Error(`Error creating blog: ${error}`);
    }
  }
  async getBlogs() {
    try {
      const result = await elasticClient.search({
        index: 'blog',
        query: {
          match_all: {},
        },
        size: 1000,
      });

      return result.hits.hits.map((hit) => ({
        id: hit._id,
        ...(hit._source as { [key: string]: any }),
      }));
    } catch (error) {
      throw new Error(`Error fetching blogs: ${error}`);
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
