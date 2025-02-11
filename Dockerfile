# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install ALL dependencies (including dev dependencies for now)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Debug: List contents before build
RUN ls -la

# Build the application
RUN npm run build

# Debug: List contents after build
RUN ls -la
RUN ls -la dist || echo "dist directory not found"

# Clean up dev dependencies
RUN npm ci --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main.js"]
