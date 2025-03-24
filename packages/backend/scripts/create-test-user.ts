import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserModel } from '@guahanweb-photography-challenges/shared';
import { config as appConfig } from '../src/config';

async function createTestUser() {
  const dynamodbClient = new DynamoDBClient({
    endpoint: appConfig.AWS_ENDPOINT_URL,
    region: appConfig.AWS_REGION,
    credentials: {
      accessKeyId: appConfig.AWS_ACCESS_KEY_ID,
      secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY,
    },
  });

  const userModel = new UserModel(dynamodbClient, appConfig.DYNAMODB_USERS_TABLE);

  try {
    const user = await userModel.createUser({
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('Test user created successfully:', { email: user.email, roles: user.roles });
  } catch (error) {
    if (error instanceof Error && error.message.includes('attribute_not_exists')) {
      console.log('Test user already exists');
    } else {
      console.error('Error creating test user:', error);
    }
  }
}

createTestUser();
