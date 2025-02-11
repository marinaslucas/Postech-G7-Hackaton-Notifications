import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionLimit = process.env.PRISMA_CONNECTION_LIMIT || '17';
    const poolTimeout = process.env.PRISMA_POOL_TIMEOUT || '20';
    
    const databaseUrl = process.env.DATABASE_URL;
    const url = new URL(databaseUrl);
    url.searchParams.set('connection_limit', connectionLimit);
    url.searchParams.set('pool_timeout', poolTimeout);
    
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
      datasources: {
        db: {
          url: url.toString(),
        },
      },
    });

    // Log queries in development
    if (process.env.NODE_ENV !== 'production') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Add middleware for retrying failed queries
    this.$use(async (params, next) => {
      const MAX_RETRIES = 3;
      const INITIAL_BACKOFF = 1000; // 1 second

      let retries = 0;
      while (true) {
        try {
          const startTime = Date.now();
          const result = await next(params);
          const duration = Date.now() - startTime;
          
          // Log slow queries
          if (duration > 1000) {
            this.logger.warn(
              `Slow database operation detected (${duration}ms): ${params.model}.${params.action}`
            );
          }
          
          return result;
        } catch (error) {
          this.logger.error(
            `Database operation failed: ${params.model}.${params.action}`,
            error.message
          );

          if (!this.isRetryableError(error) || retries >= MAX_RETRIES) {
            throw error;
          }

          retries++;
          const backoff = INITIAL_BACKOFF * Math.pow(2, retries - 1);
          this.logger.warn(
            `Retrying database operation (attempt ${retries}/${MAX_RETRIES}) after ${backoff}ms`
          );
          await new Promise((resolve) => setTimeout(resolve, backoff));
        }
      }
    });
  }

  private isRetryableError(error: any): boolean {
    // Add specific error types that should trigger a retry
    const retryableErrors = [
      'PrismaClientInitializationError',
      'PrismaClientRustPanicError',
      'PrismaClientKnownRequestError',
      'PrismaClientUnknownRequestError',
    ];

    const isRetryable = error?.constructor?.name &&
      retryableErrors.includes(error.constructor.name) &&
      !error?.message?.includes('Unique constraint');

    if (isRetryable) {
      this.logger.log(`Retryable error detected: ${error.constructor.name}`);
    }

    return isRetryable;
  }

  async onModuleInit() {
    this.logger.log(`Initializing Prisma connection (Environment: ${process.env.NODE_ENV})`);
    try {
      const startTime = Date.now();
      await this.$connect();
      const duration = Date.now() - startTime;
      this.logger.log(`Database connected successfully in ${duration}ms`);
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database');
    await this.$disconnect();
    this.logger.log('Database disconnected successfully');
  }
}
