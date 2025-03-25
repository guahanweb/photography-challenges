import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserModel } from '@guahanweb-photography-challenges/shared';
import { config } from '../../config';

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

describe('Auth Controller', () => {
  describe('authenticateUser', () => {
    it('should authenticate a valid user', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      // Create test user
      await userModel.createUser({ email, password });

      // Attempt login
      const user = await userModel.login({ email, password });
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('should reject invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      await expect(userModel.login({ email, password })).rejects.toThrow('Invalid credentials');
    });
  });
});
