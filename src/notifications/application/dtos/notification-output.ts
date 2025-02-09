import { NotificationEntity } from 'src/notifications/domain/entities/notification.entity';

export interface NotificationOutput {
  id: string;
  destinatario: string;
  titulo: string;
  mensagem: string;
  enviadoEm?: Date;
  userId?: string;
}

export class NotificationOutputMapper {
  static toOutput(entity: NotificationEntity): NotificationOutput {
    return {
      id: entity.id,
      destinatario: entity.destinatario,
      titulo: entity.titulo,
      mensagem: entity.mensagem,
      enviadoEm: entity.enviadoEm ?? new Date(),
      userId: entity.userId,
    };
  }
}
