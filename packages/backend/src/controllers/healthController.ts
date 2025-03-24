import { Request } from 'express';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BaseHandler } from '../types/handlers';
import { logger } from '../config/logger';

export const health: BaseHandler = async (
  _event: APIGatewayProxyEvent | Request,
  _context?: Record<string, unknown>
): Promise<APIGatewayProxyResult> => {
  logger.info('Health check requested');

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'ok' }),
  };

  // If this is a Lambda event, return the response directly
  if ('httpMethod' in _event) {
    return response;
  }

  // If this is an Express request, return a Response object
  return {
    status: 200,
    json: () => response.body,
  } as unknown as APIGatewayProxyResult;
};
