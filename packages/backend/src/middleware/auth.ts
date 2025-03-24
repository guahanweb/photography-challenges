import { Request } from 'express';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { BaseHandler, isLambdaEvent } from '../types/handlers';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
}

export interface AuthenticatedLambdaEvent extends APIGatewayProxyEvent {
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
}

interface ValidationResult {
  success: boolean;
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
  error?: string;
}

export const validateToken = (token: string): ValidationResult => {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Missing token',
      };
    }

    const payload = verifyToken(token);
    return {
      success: true,
      user: payload,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid token',
    };
  }
};

export const checkRole = (
  user: { userId: string; email: string; roles: string[] } | null | undefined,
  requiredRoles: string[]
): ValidationResult => {
  if (!user) {
    return {
      success: false,
      error: 'User not authenticated',
    };
  }

  const hasRole = requiredRoles.some(role => user.roles.includes(role));
  if (!hasRole) {
    return {
      success: false,
      error: 'Insufficient permissions',
    };
  }

  return {
    success: true,
    user,
  };
};

export const requireAuth = (handler: BaseHandler): BaseHandler => {
  return async (
    event: AuthenticatedRequest | APIGatewayProxyEvent,
    _context?: Record<string, unknown>
  ): Promise<APIGatewayProxyResult> => {
    try {
      const authHeader = isLambdaEvent(event)
        ? event.headers.Authorization || event.headers.authorization
        : event.headers.authorization;

      if (!authHeader) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'No authorization header' }),
        };
      }

      const token = extractTokenFromHeader(authHeader);
      const result = validateToken(token);

      if (!result.success) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: result.error }),
        };
      }

      // Add user info to request
      if (isLambdaEvent(event)) {
        (event as AuthenticatedLambdaEvent).user = result.user;
      } else {
        (event as AuthenticatedRequest).user = result.user;
      }

      // Call the handler
      return handler(event, _context);
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  };
};

export const requireRole = (roles: string[]) => {
  return (handler: BaseHandler): BaseHandler => {
    return async (
      event: AuthenticatedRequest | APIGatewayProxyEvent,
      _context?: Record<string, unknown>
    ): Promise<APIGatewayProxyResult> => {
      try {
        const user = isLambdaEvent(event)
          ? (event as AuthenticatedLambdaEvent).user
          : (event as AuthenticatedRequest).user;

        const result = checkRole(user, roles);
        if (!result.success) {
          return {
            statusCode: result.error === 'User not authenticated' ? 401 : 403,
            body: JSON.stringify({ message: result.error }),
          };
        }

        // Call the handler
        return handler(event, _context);
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal server error' }),
        };
      }
    };
  };
};
