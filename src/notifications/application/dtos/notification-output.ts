import { NotificationEntity } from "src/notifications/domain/entities/notification.entity";

export interface NotificationOutput {
  id: string;
  destinatario: string;
  titulo: string;
  mensagem: string;
  enviadoEm?: Date;
}

export class NotificationOutputMapper {
  static toOutput(entity: NotificationEntity): NotificationOutput {
    return {
      id: entity.id,
      destinatario: entity.destinatario,
      titulo: entity.titulo,
      mensagem: entity.mensagem,
      enviadoEm: new Date(),
    };
  }
}
