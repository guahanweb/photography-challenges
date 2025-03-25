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
    const { text, senderId } = body;
    if (!text || !senderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Text and senderId are required' }),
      };
    }

    // 2. Execute operation
    const result = await projectInstanceModel.addMessage(instanceId, {
      text,
      senderId,
    });

    // 3. Return response
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    return handleError(error);
  }
};
