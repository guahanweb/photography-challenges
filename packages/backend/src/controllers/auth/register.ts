import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserModel } from '@guahanweb-photography-challenges/shared';
import { generateToken } from '../../utils/jwt';
import { config } from '../../config';
import { logger } from '../../config/logger';

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

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' }),
      };
    }

    const user = await userModel.createUser({ email, password });
    // Remove sensitive data before generating token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, salt, ...userData } = user;
    const token = generateToken(userData);

    return {
      statusCode: 201,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('attribute_not_exists')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User already exists' }),
      };
    }

    logger.error('Registration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
