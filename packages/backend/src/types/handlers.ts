import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Request, Response } from 'express';

// Base handler type that works for both Express and Lambda
export type BaseHandler = (
  event: APIGatewayProxyEvent | Request,
  context?: Record<string, unknown>
) => Promise<APIGatewayProxyResult>;

export type HeaderValue = string | number | readonly string[];

export interface HandlerResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, HeaderValue>;
}

// Type guard to check if we're in a Lambda environment
export const isLambdaEvent = (
  event: APIGatewayProxyEvent | Request
): event is APIGatewayProxyEvent => {
  return (
    'isBase64Encoded' in event &&
    'requestContext' in event &&
    'resource' in event &&
    'stageVariables' in event &&
    'multiValueHeaders' in event &&
    'multiValueQueryStringParameters' in event
  );
};

const isValidHeaderValue = (value: unknown): value is HeaderValue => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    (Array.isArray(value) && value.every(item => typeof item === 'string'))
  );
};

// Helper to convert Express request to Lambda event format
export const createLambdaEvent = (req: Request): APIGatewayProxyEvent => ({
  body: JSON.stringify(req.body),
  headers: req.headers as Record<string, string>,
  httpMethod: req.method,
  isBase64Encoded: false,
  path: req.path,
  pathParameters: req.params,
  queryStringParameters: req.query as Record<string, string>,
  requestContext: {
    accountId: '',
    apiId: '',
    authorizer: null,
    protocol: 'HTTP/1.1',
    httpMethod: req.method,
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '',
      user: null,
      userAgent: req.get('user-agent') || '',
      userArn: null,
    },
    path: req.path,
    stage: '',
    requestId: '',
    requestTimeEpoch: Date.now(),
    resourceId: '',
    resourcePath: req.path,
  },
  resource: req.path,
  stageVariables: {},
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
});

// Helper to convert Lambda result to Express response
export const lambdaToExpressResponse = (result: APIGatewayProxyResult, res: Response): Response => {
  // Set status code
  res.status(result.statusCode || 200);

  // Set headers
  if (result.headers) {
    setResponseHeaders(res, result.headers);
  }

  // Set body
  if (result.body) {
    try {
      const body = JSON.parse(result.body);
      res.json(body);
    } catch (e) {
      res.send(result.body);
    }
  }

  return res;
};

export const setResponseHeaders = (res: Response, headers: Record<string, unknown>): void => {
  Object.entries(headers).forEach(([key, value]) => {
    if (isValidHeaderValue(value)) {
      res.setHeader(key, value);
    }
  });
};
