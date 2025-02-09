# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Install ffmpeg
RUN apt-get update && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev dependencies for now)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh\n\
echo "DATABASE_URL: $DATABASE_URL"\n\
npx prisma generate\n\
npm run start:prod' > /app/start.sh && \
chmod +x /app/start.sh

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application using the startup script
CMD ["/app/start.sh"]