# Development stage
FROM node:20-alpine AS development
WORKDIR /app

# Copy package files for all workspaces
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy the entire project structure
COPY . .

# Expose API port
EXPOSE 4000

# Production stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files for all workspaces
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy the entire project structure
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files for all workspaces
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install production dependencies only
RUN npm ci --only=production

# Copy built assets from builder
COPY --from=builder /app/packages/backend/dist ./dist

# Expose API port
EXPOSE 4000

# Start production server
CMD ["npm", "start"] 