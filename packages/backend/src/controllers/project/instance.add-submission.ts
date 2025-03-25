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

    const body = JSON.parse(event.body || '{}');
    // TODO: Add Zod validation schema for submission data

    // 2. Execute operation
    const result = await projectInstanceModel.addSubmission(instanceId, body);

    // 3. Return response
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    return handleError(error);
  }
};
