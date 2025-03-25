import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyToken } from '../../utils/jwt';
import { logger } from '../../config/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers.authorization;

    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No authorization header' }),
      };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No token provided' }),
      };
    }

    const userData = verifyToken(token);
    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    logger.error('Token validation error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
    };
  }
};
