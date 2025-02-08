import { NotificationEntity } from "../../../../domain/entities/notification.entity";
import { notificationDataBuilder } from "../../../../domain/testing/helpers/notification-data-builder";
import { NotificationOutputMapper } from "../../notification-output";

describe("NotificationOutputMapper unit tests", () => {
  it("should convert a notification entity to output", () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    const sut = NotificationOutputMapper.toOutput(entity);
    expect(sut).toStrictEqual({
      id: entity.id,
      destinatario: entity.destinatario,
      titulo: entity.titulo,
      mensagem: entity.mensagem,
      userId: entity.userId,
      enviadoEm: entity.enviadoEm,
    });
  });
});
