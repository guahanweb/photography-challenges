import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcryptjs';

export interface User {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  roles: string[];
}

export interface UserCreateInput {
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export class UserModel {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(client: DynamoDBClient, tableName: string) {
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async createUser(input: UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user: User = {
      email: input.email.toLowerCase(),
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
      roles: ['photographer'], // Default role for now
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: user,
        ConditionExpression: 'attribute_not_exists(email)',
      })
    );

    return user;
  }

  async login(input: UserLoginInput): Promise<User> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          email: input.email.toLowerCase(),
        },
      })
    );

    const user = result.Item as User | undefined;
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
