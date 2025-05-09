import { Client } from '@elastic/elasticsearch';
import { ElasticNode } from 'src/common/constants/constantElastic';

const elasticClient = new Client({
  node: ElasticNode,
});

export default elasticClient;
