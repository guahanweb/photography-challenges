import { Request, Response } from 'express';
import { BaseHandler } from '../types/handlers';
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

export const wrapHandler = (handler: BaseHandler) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      // Transform Express request to API Gateway event
      const event = expressToApiGatewayEvent(req);

      // Call handler with API Gateway event
      const result = (await handler(event, {})) as APIGatewayProxyResult;

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
      logger.error('Handler error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

export const withErrorHandling = (handler: BaseHandler): BaseHandler => {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      console.error('Error in handler:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  };
};
