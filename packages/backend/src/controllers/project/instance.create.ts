import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handleError } from '@guahanweb-photography-challenges/shared';
import { projectInstanceModel } from '../../models';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 1. Validate input
    const body = JSON.parse(event.body || '{}');
    // TODO: Add Zod validation schema

    // 2. Execute operation
    const result = await projectInstanceModel.createInstance(body);

    // 3. Return response
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    return handleError(error);
  }
};
