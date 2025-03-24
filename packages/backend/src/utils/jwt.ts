import jwt from 'jsonwebtoken';
import { logger } from './logger';
import { User } from '@guahanweb-photography-challenges/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  email: string;
  roles: string[];
  createdAt: string;
}

export const generateToken = (user: Omit<User, 'passwordHash' | 'salt'>): string => {
  try {
    return jwt.sign(user, JWT_SECRET as jwt.Secret, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate token');
  }
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as JWTPayload;
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    throw new Error('Invalid token');
  }
};

export const extractTokenFromHeader = (header: string): string => {
  try {
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new Error('Invalid authorization header format');
    }
    return token;
  } catch (error) {
    logger.error('Error extracting token from header:', error);
    throw new Error('Invalid authorization header format');
  }
};
