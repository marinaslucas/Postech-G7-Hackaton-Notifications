import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infraestructure/env-config/env-config.module';
import { DatabaseModule } from './shared/infraestructure/database/database.module';
import { AuthModule } from './auth/infraestructure/auth.module';
import { NotificationsModule } from './notifications/infraestructure/notification.module';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    AuthModule,
    NotificationsModule
  ],
})
export class AppModule {}
