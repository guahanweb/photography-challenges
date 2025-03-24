# Photography Challenges

A web application for creating and assigning photography challenges to friends.

## Project Structure

This is a monorepo using npm workspaces with the following packages:

- `packages/frontend`: React application for the web interface
- `packages/backend`: API server and business logic
- `packages/shared`: Shared types and utilities

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- AWS CLI (for local development with Localstack)

### Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local development environment:

   ```bash
   docker-compose up -d
   ```

3. Start the development servers:

   ```bash
   # Start backend
   npm run dev --workspace=packages/backend

   # Start frontend
   npm run dev --workspace=packages/frontend
   ```

## Development Guidelines

- All code is written in TypeScript
- Frontend uses React with functional components and hooks
- Backend routes are designed to be AWS Lambda-compatible
- Styling is done with TailwindCSS
- Testing is required for components and happy-path flows

## Infrastructure

The application is designed to run on AWS:

- API Gateway + Lambda for the backend
- CloudFront + S3 for static assets and images
- DynamoDB for data storage
- ValKey for real-time features and caching

Local development uses Localstack to mirror the AWS environment.

## License

Private - All rights reserved
