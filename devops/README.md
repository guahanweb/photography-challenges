# Development Operations

This directory contains configuration and automation scripts for the development environment.

## Docker Development Environment

The Docker setup provides a complete local development environment that mirrors our production AWS infrastructure.

### Services

- **Frontend**: Vite development server
- **Backend**: Express development server
- **DynamoDB Local**: Local DynamoDB instance
- **LocalStack**: AWS services simulation (S3, Lambda, API Gateway, EventBridge)

### Prerequisites

- Docker
- Docker Compose
- Node.js 20+ (for local development)

### Getting Started

1. Start the development environment:

   ```bash
   ./dev start
   ```

2. Access the services:
   - Frontend: http://localhost:${FRONTEND_PORT}
   - Backend API: http://localhost:${BACKEND_PORT}
   - DynamoDB Local: http://localhost:${DYNAMODB_PORT}
   - LocalStack: http://localhost:${LOCALSTACK_PORT}

### Available Commands

- `./dev start` - Start all services
- `./dev stop` - Stop all services and remove volumes
- `./dev restart <service>` - Restart a specific service
- `./dev redeploy <service>` - Rebuild and redeploy a service
- `./dev exec <service> <command>` - Execute a command in a service container
- `./dev localstack <command>` - Manage LocalStack services

### Environment Variables

The following environment variables are configured in `docker/.env`:

#### Application Ports

- `FRONTEND_PORT`: Frontend development server port
- `BACKEND_PORT`: Backend API server port
- `DYNAMODB_PORT`: DynamoDB Local port
- `LOCALSTACK_PORT`: LocalStack port

#### AWS Configuration

- `AWS_REGION`: AWS region for services
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

#### Service Endpoints

- `DYNAMODB_ENDPOINT`: DynamoDB Local endpoint
- `S3_ENDPOINT`: LocalStack S3 endpoint
- `LAMBDA_ENDPOINT`: LocalStack Lambda endpoint
- `APIGATEWAY_ENDPOINT`: LocalStack API Gateway endpoint
- `EVENTS_ENDPOINT`: LocalStack EventBridge endpoint

#### Frontend Configuration

- `VITE_API_URL`: Backend API URL for frontend

#### LocalStack Configuration

- `LOCALSTACK_SERVICES`: Enabled LocalStack services
- `LAMBDA_EXECUTOR`: Lambda execution environment
- `LAMBDA_REMOTE_DOCKER`: Remote Docker configuration
- `LAMBDA_DOCKER_FLAGS`: Docker flags for Lambda
- `LAMBDA_DOCKER_NETWORK`: Docker network for Lambda
- `LAMBDA_DOCKER_HOST`: Docker host for Lambda

### Development Workflow

1. The frontend and backend services use volume mounts to enable hot-reloading
2. Changes to the source code will automatically trigger rebuilds
3. DynamoDB and LocalStack data persist between container restarts

### Troubleshooting

1. If services fail to start, check the logs:

   ```bash
   docker compose -f docker/docker-compose.yml logs
   ```

2. To reset the environment:
   ```bash
   ./dev stop
   ./dev start
   ```
