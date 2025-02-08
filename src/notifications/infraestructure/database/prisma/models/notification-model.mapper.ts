import { ValidationError } from "../../../../../shared/domain/errors/validation-error";
import { NotificationEntity } from "../../../../domain/entities/notification.entity";
import { Notification } from "@prisma/client";

export class NotificationModelMapper {
  static toEntity(model: Notification) {
    try {
      return new NotificationEntity(
        {
          destinatario: model.destinatario,
          titulo: model.titulo,
          userId: model.userId,
          mensagem: model.mensagem,
          enviadoEm: model.enviadoEm,
        },
        model.id
      );
    } catch (error) {
      throw new ValidationError("NotificationEntity not loaded");
    }
  }

  static toModel(entity: NotificationEntity): Omit<Notification, "id"> {
    return {
      destinatario: entity.destinatario,
      titulo: entity.titulo,
      userId: entity.userId,
      mensagem: entity.mensagem,
      enviadoEm: entity.enviadoEm,
    };
  }
}
