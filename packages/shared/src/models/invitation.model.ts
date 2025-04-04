import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Invitation, InvitationCreateInput, InvitationUpdateInput } from '../types/invitation';

export class InvitationModel {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(client: DynamoDBClient, tableName: string) {
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async create(input: InvitationCreateInput): Promise<Invitation> {
    const timestamp = new Date().toISOString();
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const code = await this.generateUniqueCode();
    const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now

    const invitation: Invitation = {
      invitationId,
      code,
      email: input.email.toLowerCase(), // Store email in lowercase for case-insensitive matching
      from: input.from,
      status: 'PENDING',
      expiresAt,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: invitation,
        ConditionExpression: 'attribute_not_exists(invitationId)',
      })
    );

    return invitation;
  }

  async getByCode(code: string): Promise<Invitation | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'CodeIndex',
        KeyConditionExpression: 'code = :code',
        ExpressionAttributeValues: {
          ':code': code,
        },
        Limit: 1,
      })
    );

    return (result.Items?.[0] as Invitation) || null;
  }

  async getById(invitationId: string): Promise<Invitation | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { invitationId },
      })
    );

    return (result.Item as Invitation) || null;
  }

  async listByUser(
    userId: string,
    status?: 'PENDING' | 'CLAIMED' | 'EXPIRED',
    limit: number = 10,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<{
    items: Invitation[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const params = {
      TableName: this.tableName,
      IndexName: 'FromUserIndex',
      KeyConditionExpression: 'fromUserId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      } as Record<string, string>,
      ExpressionAttributeNames: {} as Record<string, string>,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    if (status) {
      params.KeyConditionExpression += ' AND #status = :status';
      params.ExpressionAttributeNames['#status'] = 'status';
      params.ExpressionAttributeValues[':status'] = status;
    }

    const result = await this.docClient.send(new QueryCommand(params));

    return {
      items: (result.Items as Invitation[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async update(invitationId: string, input: InvitationUpdateInput): Promise<Invitation | null> {
    const timestamp = new Date().toISOString();

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    // Handle user-provided fields
    Object.entries(input).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    // Always update the updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = timestamp;

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { invitationId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return (result.Attributes as Invitation) || null;
  }

  async checkExistingInvitations(email: string, status: 'PENDING'): Promise<Invitation[]> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email AND #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':email': email.toLowerCase(),
          ':status': status,
        },
      })
    );

    return (result.Items as Invitation[]) || [];
  }

  private async generateUniqueCode(): Promise<string> {
    const generateCode = (length: number = 8) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      code = generateCode();
      const existing = await this.getByCode(code);
      isUnique = !existing;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      throw new Error('Failed to generate unique invitation code');
    }

    return code;
  }
}
