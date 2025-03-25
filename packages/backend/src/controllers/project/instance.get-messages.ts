import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handleError } from '@guahanweb-photography-challenges/shared';
import { projectInstanceModel } from '../../models';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 1. Validate input
    const instanceId = event.pathParameters?.instanceId;
    if (!instanceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Instance ID is required' }),
      };
    }

    const limit = parseInt(event.queryStringParameters?.limit || '10', 10);
    const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey
      ? JSON.parse(event.queryStringParameters.lastEvaluatedKey)
      : undefined;

    // 2. Execute operation
    const result = await projectInstanceModel.getMessages(instanceId, limit, lastEvaluatedKey);

    // 3. Return response
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    return handleError(error);
  }
};
