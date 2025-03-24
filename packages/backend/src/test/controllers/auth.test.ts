import { verifyToken } from '../../utils/jwt';
import { authenticateUser } from '../../controllers/authController';

describe('Auth Controller', () => {
  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authenticateUser(credentials);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();

      const decoded = verifyToken(result.token as string);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.roles).toEqual(['user']);
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const result = await authenticateUser(credentials);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should handle missing credentials', async () => {
      const credentials = {
        email: '',
        password: '',
      };

      const result = await authenticateUser(credentials);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing credentials');
    });
  });
});
