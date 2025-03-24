import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ProjectInstance, ProjectSubmission, ProjectMessage } from '../types/project';

export interface ProjectInstanceCreateInput
  extends Omit<ProjectInstance, 'instanceId' | 'createdAt' | 'updatedAt'> {}

export interface ProjectInstanceUpdateInput
  extends Partial<Omit<ProjectInstance, 'instanceId' | 'createdAt'>> {}

export interface ProjectSubmissionCreateInput extends Omit<ProjectSubmission, 'instanceId'> {}

export interface ProjectMessageCreateInput
  extends Omit<ProjectMessage, 'instanceId' | 'messageId' | 'timestamp'> {}

export class ProjectInstanceModel {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(client: DynamoDBClient, tableName: string) {
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async createInstance(input: ProjectInstanceCreateInput): Promise<ProjectInstance> {
    const timestamp = new Date().toISOString();
    const instanceId = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const instance: ProjectInstance = {
      ...input,
      instanceId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...instance,
          type: 'instance',
        },
        ConditionExpression: 'attribute_not_exists(instanceId)',
      })
    );

    return instance;
  }

  async getInstance(instanceId: string): Promise<ProjectInstance | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          instanceId,
          type: 'instance',
        },
      })
    );

    return (result.Item as ProjectInstance) || null;
  }

  async updateInstance(
    instanceId: string,
    input: ProjectInstanceUpdateInput
  ): Promise<ProjectInstance | null> {
    const timestamp = new Date().toISOString();
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    Object.entries(input).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = timestamp;

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          instanceId,
          type: 'instance',
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return (result.Attributes as ProjectInstance) || null;
  }

  async addSubmission(
    instanceId: string,
    input: ProjectSubmissionCreateInput
  ): Promise<ProjectSubmission> {
    const timestamp = new Date().toISOString();
    const submission: ProjectSubmission = {
      ...input,
      instanceId,
      date: timestamp,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...submission,
          type: `submission:${timestamp}`,
        },
      })
    );

    return submission;
  }

  async addMessage(instanceId: string, input: ProjectMessageCreateInput): Promise<ProjectMessage> {
    const timestamp = new Date().toISOString();
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const message: ProjectMessage = {
      ...input,
      instanceId,
      messageId,
      timestamp,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...message,
          type: `message:${timestamp}`,
        },
      })
    );

    return message;
  }

  async getSubmissions(
    instanceId: string,
    limit: number = 10,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<{
    items: ProjectSubmission[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'instanceId = :instanceId AND begins_with(#type, :type)',
        ExpressionAttributeNames: {
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ':instanceId': instanceId,
          ':type': 'submission:',
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    return {
      items: (result.Items as ProjectSubmission[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async getMessages(
    instanceId: string,
    limit: number = 10,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<{
    items: ProjectMessage[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'instanceId = :instanceId AND begins_with(#type, :type)',
        ExpressionAttributeNames: {
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ':instanceId': instanceId,
          ':type': 'message:',
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    return {
      items: (result.Items as ProjectMessage[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async getUserProjects(
    userId: string,
    limit: number = 10,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<{
    items: ProjectInstance[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'UserProjectsIndex',
        KeyConditionExpression: 'assignedTo = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    return {
      items: (result.Items as ProjectInstance[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async getMentorProjects(
    mentorId: string,
    limit: number = 10,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<{
    items: ProjectInstance[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'MentorProjectsIndex',
        KeyConditionExpression: 'assignedBy = :mentorId',
        ExpressionAttributeValues: {
          ':mentorId': mentorId,
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    return {
      items: (result.Items as ProjectInstance[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }
}
