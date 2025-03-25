import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handleError } from '@guahanweb-photography-challenges/shared';
import { projectModel } from '../../models';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 1. Validate input
    const projectId = event.pathParameters?.projectId;
    const version = parseInt(event.queryStringParameters?.version || '1', 10);
    // TODO: Add Zod validation schema

    // 2. Execute operation
    await projectModel.delete(projectId!, version);

    // 3. Return response
    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    return handleError(error);
  }
};
