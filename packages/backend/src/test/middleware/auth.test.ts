import { generateToken } from '../../utils/jwt';
import { validateToken, checkRole } from '../../middleware/auth';

describe('Auth Middleware', () => {
  const mockUser = {
    userId: '1',
    email: 'test@example.com',
    roles: ['user'],
  };

  describe('validateToken', () => {
    it('should validate a valid token', () => {
      const token = generateToken(mockUser);
      const result = validateToken(token);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();

      // We know user exists here because we checked result.success
      const user = result.user as typeof mockUser;
      expect(user.email).toBe(mockUser.email);
      expect(user.roles).toEqual(mockUser.roles);
    });

    it('should reject an invalid token', () => {
      const result = validateToken('invalid-token');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid token');
    });

    it('should reject a missing token', () => {
      const result = validateToken('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing token');
    });
  });

  describe('checkRole', () => {
    it('should allow access with required role', () => {
      const result = checkRole(mockUser, ['user']);
      expect(result.success).toBe(true);
    });

    it('should deny access without required role', () => {
      const result = checkRole(mockUser, ['admin']);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions');
    });

    it('should handle missing user', () => {
      const result = checkRole(null, ['user']);
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not authenticated');
    });
  });
});
