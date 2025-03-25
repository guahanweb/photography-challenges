import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const expressToApiGatewayEvent = (req: Request): APIGatewayProxyEvent => {
  return {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers as Record<string, string>,
    queryStringParameters: req.query as Record<string, string>,
    pathParameters: req.params as Record<string, string>,
    body: JSON.stringify(req.body),
    isBase64Encoded: false,
    resource: '',
    requestContext: {} as any,
    stageVariables: {},
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
  };
};

type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export const wrapHandler = (handler: LambdaHandler) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      // Transform Express request to API Gateway event
      const event = expressToApiGatewayEvent(req);

      // Call handler with API Gateway event
      const result = await handler(event);

      // Handle API Gateway response
      if (result.statusCode) {
        res.status(result.statusCode);
      }
      if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            res.setHeader(key, value);
          }
        });
      }

      // Send response body
      try {
        const body = JSON.parse(result.body);
        res.json(body);
      } catch (e) {
        res.send(result.body);
      }
    } catch (error) {
      logger.error('Error in handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const withErrorHandling = (handler: LambdaHandler): LambdaHandler => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      return await handler(event);
    } catch (error) {
      logger.error('Error in handler:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  };
};
