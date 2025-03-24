#!/bin/bash

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Exit on error
set -e

# Default values
ENVIRONMENT=${1:-dev}
AWS_PROFILE=${AWS_PROFILE:-localstack}
STACK_NAME="photography-challenges-${ENVIRONMENT}"
TEMPLATE_DIR="${DIR}/../cloudformation"
TEMPLATE_FILE="${TEMPLATE_DIR}/dynamodb.yml"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo "Error: Environment must be one of: dev, staging, prod"
    exit 1
fi

# Validate template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template file not found at ${TEMPLATE_FILE}"
    exit 1
fi

# Deploy to localstack
echo "Deploying ${TEMPLATE_FILE} to localstack..."
aws cloudformation deploy \
    --template-file ${TEMPLATE_FILE} \
    --stack-name ${STACK_NAME} \
    --parameter-overrides Environment=${ENVIRONMENT} \
    --profile ${AWS_PROFILE} \
    --capabilities CAPABILITY_IAM

echo "Deployment complete!" 