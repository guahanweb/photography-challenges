import { Request } from 'express';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateToken } from '../utils/jwt';
import { BaseHandler, isLambdaEvent } from '../types/handlers';

interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

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

  // TODO: Replace with actual authentication logic
  if (email === 'test@example.com' && password === 'password123') {
    const token = generateToken({
      userId: '1',
      email,
      roles: ['user'],
    });

    return {
      success: true,
      token,
    };
  }

  return {
    success: false,
    error: 'Invalid credentials',
  };
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
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
