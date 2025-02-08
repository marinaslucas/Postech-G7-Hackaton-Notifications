import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { SendNotificationUseCase } from "../application/usecases/send-notification.usecase";
import { NotificationInMemoryRepository } from "../infraestructure/database/in-memory/repositories/notification-in-memory.repository";
import { NotificationRepository } from "../domain/repositories/notification.repository";
import { PrismaService } from "../../shared/infraestructure/database/prisma/prisma.service";
import { NotificationPrismaRepository } from "./database/prisma/repositories/nofitication-prisma.repository";
import { AuthModule } from "../../auth/infraestructure/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [NotificationController],
  providers: [
    { provide: "PrismaService", useClass: PrismaService },
    {
      provide: "NotificationRepository",
      useFactory: (prismaService: PrismaService) =>
        new NotificationPrismaRepository(prismaService),
      inject: ["PrismaService"],
    },
    {
      provide: SendNotificationUseCase,
      useFactory: (notificationRepository: NotificationRepository.Repository) => {
        return new SendNotificationUseCase(notificationRepository);
      },
      inject: ["NotificationRepository"],
    },
  ],
  exports: ["NotificationRepository", SendNotificationUseCase],
})
export class NotificationsModule {}
