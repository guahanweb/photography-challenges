import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ProjectModel, ProjectInstanceModel } from '@guahanweb-photography-challenges/shared';
import { config } from '../config';

// TODO: For Lambda deployment, we'll need to handle client initialization differently:
// - Initialize client at module level for container reuse
// - Consider AWS SDK's built-in client caching
// - May need Lambda-specific initialization utility

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
  ...(config.AWS_ENDPOINT_URL ? { endpoint: config.AWS_ENDPOINT_URL } : {}),
});

// Initialize shared models
export const projectModel = new ProjectModel(client, config.DYNAMODB_PROJECTS_TABLE);
export const projectInstanceModel = new ProjectInstanceModel(
  client,
  config.DYNAMODB_PROJECT_INSTANCES_TABLE
);
