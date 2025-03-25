import { APIGatewayProxyResult } from 'aws-lambda';

export const handleError = (error: unknown): APIGatewayProxyResult => {
  console.error('Error:', error);

  if (error instanceof Error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      success: false,
      error: 'An unexpected error occurred',
    }),
  };
};
