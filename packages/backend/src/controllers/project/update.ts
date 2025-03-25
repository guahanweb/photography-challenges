import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handleError } from '@guahanweb-photography-challenges/shared';
import { projectModel } from '../../models';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 1. Validate input
    const projectId = event.pathParameters?.projectId;
    const version = parseInt(event.queryStringParameters?.version || '1', 10);
    const body = JSON.parse(event.body || '{}');
    // TODO: Add Zod validation schema

    // 2. Execute operation
    const result = await projectModel.update(projectId!, version, body);

    // 3. Return response
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    return handleError(error);
  }
};
