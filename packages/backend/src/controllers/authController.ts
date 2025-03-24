import { Request } from 'express';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserModel } from '@guahanweb-photography-challenges/shared';
import { generateToken, verifyToken } from '../utils/jwt';
import { BaseHandler, isLambdaEvent } from '../types/handlers';
import { config } from '../config';

interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

// Initialize DynamoDB client
const dynamodbClient = new DynamoDBClient({
  endpoint: config.AWS_ENDPOINT_URL,
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

const userModel = new UserModel(dynamodbClient, config.DYNAMODB_USERS_TABLE);

export const createUser = async (input: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const { email, password } = input;

  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  try {
    const user = await userModel.createUser({ email, password });
    // Remove sensitive data before generating token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, salt, ...userData } = user;
    const token = generateToken(userData);

    return {
      success: true,
      token,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('attribute_not_exists')) {
      return {
        success: false,
        error: 'User already exists',
      };
    }
    throw error;
  }
};

export const authenticateUser = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const { email, password } = credentials;

  if (!email || !password) {
    return {
      success: false,
      error: 'Missing credentials',
    };
  }

  try {
    const user = await userModel.login({ email, password });
    // Remove sensitive data before generating token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, salt, ...userData } = user;
    const token = generateToken(userData);

    return {
      success: true,
      token,
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }
    throw error;
  }
};

export const login: BaseHandler = async (
  event: APIGatewayProxyEvent | Request,
  _context?: Record<string, unknown>
): Promise<APIGatewayProxyResult> => {
  try {
    const body = isLambdaEvent(event) ? JSON.parse(event.body || '{}') : event.body;

    const result = await authenticateUser(body);

    if (result.success) {
      return {
        statusCode: 200,
        body: JSON.stringify({ token: result.token }),
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ message: result.error }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const register: BaseHandler = async (
  event: APIGatewayProxyEvent | Request,
  _context?: Record<string, unknown>
): Promise<APIGatewayProxyResult> => {
  try {
    const body = isLambdaEvent(event) ? JSON.parse(event.body || '{}') : event.body;

    const result = await createUser(body);

    if (result.success) {
      return {
        statusCode: 201,
        body: JSON.stringify({ token: result.token }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: result.error }),
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const validateToken: BaseHandler = async (
  event: APIGatewayProxyEvent | Request,
  _context?: Record<string, unknown>
): Promise<APIGatewayProxyResult> => {
  try {
    const headers = isLambdaEvent(event) ? event.headers : (event as Request).headers;
    const authHeader = headers.authorization;

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
    console.error('Token validation error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' }),
    };
  }
};
