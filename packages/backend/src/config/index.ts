import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  // AWS Configuration
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().default('test'),
  AWS_SECRET_ACCESS_KEY: z.string().default('test'),
  AWS_ENDPOINT_URL: z.string().optional(),
  // DynamoDB Configuration
  DYNAMODB_USERS_TABLE: z.string().min(1, 'DYNAMODB_USERS_TABLE is required'),
  DYNAMODB_PROJECTS_TABLE: z.string().min(1, 'DYNAMODB_PROJECTS_TABLE is required'),
  DYNAMODB_PROJECT_INSTANCES_TABLE: z
    .string()
    .min(1, 'DYNAMODB_PROJECT_INSTANCES_TABLE is required'),
});

const parseEnvVars = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const config = parseEnvVars();
