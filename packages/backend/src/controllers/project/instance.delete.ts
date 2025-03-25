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

    // 2. Execute operation
    await projectInstanceModel.updateInstance(instanceId, { deleted: true });

    // 3. Return response
    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    return handleError(error);
  }
};
