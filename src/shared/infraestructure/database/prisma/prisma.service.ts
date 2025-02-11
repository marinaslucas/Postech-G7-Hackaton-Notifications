import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
          // Connection pooling is configured via connection URL
          // Example: postgresql://user:password@localhost:5432/mydb?connection_limit=10&pool_timeout=20
        },
      },
    });
  }

  async onModuleInit() {
    // Enable soft delete middleware
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
