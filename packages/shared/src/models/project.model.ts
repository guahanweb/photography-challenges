import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Project } from '../types/project';

export interface ProjectCreateInput
  extends Omit<Project, 'projectId' | 'version' | 'createdAt' | 'updatedAt'> {
  createdBy: string;
}

export interface ProjectUpdateInput extends Partial<Omit<Project, 'projectId'>> {
  // Allow all fields except projectId to be updated
  // version, createdAt, and updatedAt will be filtered out in the update method
}

export class ProjectModel {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(client: DynamoDBClient, tableName: string) {
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    const timestamp = new Date().toISOString();
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const project: Project = {
      ...input,
      projectId,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      isActive: true,
      isPublished: false,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: project,
        ConditionExpression: 'attribute_not_exists(projectId)',
      })
    );

    return project;
  }

  async get(projectId: string, version: number): Promise<Project | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          projectId,
          version,
        },
      })
    );

    return (result.Item as Project) || null;
  }

  async update(
    projectId: string,
    version: number,
    input: ProjectUpdateInput
  ): Promise<Project | null> {
    const timestamp = new Date().toISOString();
    // const newVersion = version + 1;

    // Filter out reserved fields that we manage automatically
    const { version: _, updatedAt: __, createdAt: ___, ...updateFields } = input;

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    // Handle user-provided fields
    Object.entries(updateFields).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    // Add automatic fields
    // updateExpressions.push('#version = :version');
    updateExpressions.push('#updatedAt = :updatedAt');
    // expressionAttributeNames['#version'] = 'version';
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    // expressionAttributeValues[':version'] = newVersion;
    expressionAttributeValues[':updatedAt'] = timestamp;

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          projectId,
          version,
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return (result.Attributes as Project) || null;
  }

  async delete(projectId: string, version: number): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          projectId,
          version,
        },
      })
    );
  }

  async list(
    limit: number = 10,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<{
    items: Project[];
    lastEvaluatedKey?: Record<string, unknown>;
  }> {
    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    return {
      items: (result.Items as Project[]) || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }
}
