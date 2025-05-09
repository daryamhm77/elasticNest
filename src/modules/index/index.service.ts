import { BadRequestException, Injectable } from '@nestjs/common';
import elasticClient from 'src/config/elasticSearch.client';

@Injectable()
export class IndexService {
  async createIndex(indexName: string) {
    if (!indexName || typeof indexName !== 'string') {
      throw new BadRequestException('idexname is invalid');
    }
    try {
      const result = await elasticClient.indices.create({
        index: indexName,
      });
      return result;
    } catch (error) {
      throw new Error(`Error creating index: ${error}`);
    }
  }
  async getAllIndices() {
    try {
      const result = await elasticClient.indices.getAlias();
      return Object.keys(result);
    } catch (error) {
      throw new Error(`Error getting indices: ${error}`);
    }
  }
  async deleteIndex(indexName: string) {
    if (!indexName) {
      throw new BadRequestException('idexname is required');
    }
    try {
      const result = await elasticClient.indices.delete({
        index: indexName,
      });
      return result;
    } catch (error) {
      throw new Error(`Error deleting index: ${error}`);
    }
  }
}
