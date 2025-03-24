import { generateToken, verifyToken, extractTokenFromHeader } from '../../utils/jwt';

describe('JWT Utils', () => {
  const testPayload = {
    userId: '1',
    email: 'test@example.com',
    roles: ['user'],
  };

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const token = generateToken(testPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);
      // JWT adds exp and iat claims, so we only check our payload fields
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.roles).toEqual(testPayload.roles);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid token');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid header', () => {
      const token = generateToken(testPayload);
      const header = `Bearer ${token}`;
      const extracted = extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it('should throw error for invalid header format', () => {
      expect(() => extractTokenFromHeader('InvalidFormat')).toThrow(
        'Invalid authorization header format'
      );
      expect(() => extractTokenFromHeader('Bearer')).toThrow('Invalid authorization header format');
      expect(() => extractTokenFromHeader('')).toThrow('Invalid authorization header');
    });
  });
});
